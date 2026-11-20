from sqlmodel import Session, select
from fastapi import HTTPException, status
from models.inventario_model import Inventario
from schemas.inventario_schema import InventarioCreate, InventarioUpdate

def crear_inventario(session: Session, inventario_data: InventarioCreate):
    # Opcional: Validar si ya existe un item con el mismo código
    existing = session.exec(select(Inventario).where(Inventario.codigo == inventario_data.codigo)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un artículo en el inventario con este código.")

    nuevo_item = Inventario(**inventario_data.model_dump())
    session.add(nuevo_item)
    session.commit()
    session.refresh(nuevo_item)
    return nuevo_item

def obtener_inventarios(session: Session, skip: int = 0, limit: int = 100):
    return session.exec(
        select(Inventario)
        .where(Inventario.is_active == True)  # <-- Filtra solo los activos
        .offset(skip)
        .limit(limit)
    ).all()    

def obtener_inventario_por_id(session: Session, id_inv: int):
    item = session.get(Inventario, id_inv)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artículo de inventario no encontrado")
    return item

def actualizar_inventario(session: Session, id_inv: int, inventario_data: InventarioUpdate):
    item = session.get(Inventario, id_inv)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artículo de inventario no encontrado")
    
    update_dict = inventario_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(item, key, value)
        
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
""" 
def eliminar_inventario(session: Session, id_inv: int):
    item = session.get(Inventario, id_inv)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artículo de inventario no encontrado")
    
    session.delete(item)
    session.commit()
    return {"message": "Artículo de inventario eliminado exitosamente"} """

def delete_inventario(session: Session, id_inv: int):
    item = session.get(Inventario, id_inv)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Artículo de inventario no encontrado o ya inactivo"
        )
    
    item.is_active = False  
    
    session.add(item)
    session.commit()
    return {"message": "Artículo de inventario inactivado exitosamente"}