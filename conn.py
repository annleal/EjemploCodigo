import os
import json
from typing import Any
from sqlalchemy import ForeignKey, create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,relationship
from app import app


config_dir = os.path.join(app.root_path, 'config')


def load_config():
    with open(os.path.join(config_dir, 'config.json')) as f:
        return json.load(f)


config = load_config()

# Configurar o engine do SQLAlchemy
db_url = f"mssql+pyodbc://{config['username']}:{config['password']}@{config['server']}/{config['database']}?driver=SQL+Server"
engine = create_engine(db_url)

# Configurar a ORM e a classe base
Base = declarative_base()
Session = sessionmaker(bind=engine)


class Familia(Base):
    __tablename__ = 'Familia'

    IdFamilia = Column(String, primary_key=True)
    Descripcion = Column(String)
    Servicio = Column(String)
    CodTipo = Column(Integer)
    Activo = Column(String)

    def __init__(self, IdFamilia, Descripcion, Servicio, CodTipo,Activo):
        self.IdFamilia = IdFamilia
        self.Descripcion = Descripcion
        self.Servicio = Servicio
        self.CodTipo = CodTipo
        self.Activo = Activo



class SubFamilia(Base):
    __tablename__ = 'SubFamilia'

    IdSubFamilia = Column(String)
    Descripcion = Column(String)
    IdFamilia = Column(String,primary_key = True)
    Servicio = Column(String)
    Activo = Column(String)

    def __init__(self, IdSubFamilia, Descripcion, IdFamilia,Servicio,Activo):
        self.IdSubFamilia = IdSubFamilia
        self.Descripcion = Descripcion
        self.IdFamilia = IdFamilia
        self.Servicio = Servicio
        self.Activo = Activo
    prestaciones = relationship("Prestacion", back_populates="idsubfamilia")


class TipoPrestacion(Base):
    __tablename__ = 'TipoPrestacion'

    Codigo = Column(String,primary_key = True)
    Descripcion = Column(String)


    def __init__(self, Codigo, Descripcion):
        self.Codigo = Codigo
        self.Descripcion = Descripcion
       
class Prestacion(Base):
    __tablename__ = 'Prestacion'
    IdCatalogo = Column(String)
    IdPrestacion = Column(String, primary_key=True)
    IdFamilia = Column(String)
    Activo = Column(Integer)
    Descripcion = Column(String)
    UnidadMedida = Column(String)
    Duracion = Column(Integer)
    IdSubFamilia = Column(String, ForeignKey('SubFamilia.IdSubFamilia'))
    idsubfamilia = relationship("SubFamilia", back_populates="prestaciones")
    

    def __init__(self, IdCatalogo, IdPrestacion, IdFamilia, IdSubFamilia, Activo, Descripcion, UnidadMedida, Duracion):
        self.IdCatalogo = IdCatalogo
        self.IdPrestacion = IdPrestacion
        self.IdFamilia = IdFamilia
        self.IdSubFamilia = IdSubFamilia
        self.Activo = Activo
        self.Descripcion = Descripcion
        self.UnidadMedida = UnidadMedida
        self.Duracion = Duracion
       


class Catalago(Base):
    __tablename__ = 'Catalogo'
    IdCatalogo = Column(String, primary_key=True)
    Descripcion = Column(String)

class OrigenPrestacion(Base):
    __tablename__ = 'OrigenPrestacion'
    CodCentro = Column(String,primary_key =True)
    IdAmbito = Column(String)
    IdServicio = Column(String)
    IdPrestacion = Column(String,ForeignKey('Prestacion.IdPrestacion'))
    Activo = 1
    

    def __init__(self,CodCentro,IdAmbito,IdServicio,IdPrestacion,Activo ) :
        self.CodCentro = CodCentro
        self.IdAmbito=IdAmbito
        self.IdServicio= IdServicio
        self.IdPrestacion=IdPrestacion
        self.Activo=Activo
      
class PrestacionServicio(Base):
    __tablename__ = 'PrestacionServicio'
    IdCatalogo = Column(String,primary_key =True)
    IdPrestacion = Column(String,primary_key =True)
    IdServicio = Column(String,primary_key =True)
    Agendable = Column(String,primary_key =True)
    Duracion = Column(String,primary_key =True)
    CodCentro = Column(String,primary_key =True)
    Departamental = Column(String,primary_key=True)
    Incremento = Column(String,primary_key =True)
    Decremento = Column(String,primary_key =True)
    Activo = 1
    

    def __init__(self,IdCatalogo,IdPrestacion,IdServicio,Activo,Agendable,Duracion,CodCentro,Departamental,Incremento,Decremento ) :
        self.IdCatalogo = IdCatalogo
        self.IdPrestacion=IdPrestacion
        self.IdServicio= IdServicio
        self.Activo=Activo
        self.Agendable=Agendable
        self.Duracion= Duracion
        self.CodCentro= CodCentro
        self.Departamental=Departamental
        self.Incremento= Incremento
        self.Decremento= Decremento

class Servicio(Base):
    __tablename__ = 'Servicio'
    IdServicio = Column(String,primary_key=True)
    Descripcion = Column(String,primary_key = True)

    def __int__(self,IdServicio,Descripcion):
        self.IdServicio=IdServicio
        self.Descripcion=Descripcion

class Ambito(Base):
    __tablename__ = 'Ambito'
    IdAmbito = Column(String,primary_key=True)
    Descripcion = Column(String,primary_key = True)

    def __int__(self,IdAmbito,Descripcion):
        self.IdAmbito=IdAmbito
        self.Descripcion=Descripcion