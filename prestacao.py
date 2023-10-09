from flask import request, jsonify
import math
from sqlalchemy import text
from conn import Session, Prestacion, TipoPrestacion, Familia, SubFamilia
from app import app


def search_prestacao(session, IdPrestacion, Descripcion, pagina):
    from sqlalchemy import and_

    registros_por_pagina = 50
    primeiro_registro = (pagina - 1) * registros_por_pagina

    query = session.query(
        TipoPrestacion.Descripcion.label('tipo'),
        TipoPrestacion.Codigo.label('CodigoTipo'),
        Familia.IdFamilia.label('CodigoFamilia'),
        Familia.Descripcion.label('Familia'),
        SubFamilia.IdSubFamilia.label('CodigoSubFamilia'),
        SubFamilia.Descripcion.label('SubFamilia'),
        Prestacion.IdPrestacion.label('CodigoPrestacion'),
        Prestacion.Descripcion.label('prestacion'),
        Prestacion.UnidadMedida,
        Prestacion.Duracion
        ).select_from(Prestacion).join(SubFamilia, Prestacion.IdSubFamilia == SubFamilia.IdSubFamilia)\
    .join(Familia, SubFamilia.IdFamilia == Familia.IdFamilia)\
    .join(TipoPrestacion, Familia.CodTipo == TipoPrestacion.Codigo)

    query = query.filter(
        and_(
            (Prestacion.IdPrestacion == IdPrestacion) if IdPrestacion else True,
            Prestacion.Descripcion.contains(Descripcion) if Descripcion else True,
            
        )
    )
    print(query)
    results = query.order_by(Prestacion.IdPrestacion)\
        .offset(primeiro_registro)\
        .limit(registros_por_pagina)\
        .all()

    total_registros = query.count()

    # Você pode converter os resultados em dicionários, se necessário
    results_as_dicts = [row._asdict() for row in results]

    return results_as_dicts, total_registros


def search_prestacao_route():
    data = request.get_json()
    idPrestacion = data.get('idPrestacion')
    Descripcion = data.get('Descripcion')

    pagina = int(request.args.get('page', '1'))

    # Adicione a linha abaixo para criar a sessão
    session = Session()

    dict_results, total_registros = search_prestacao(
        session, idPrestacion, Descripcion, pagina)

    registros_por_pagina = 50
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    # Adicione a linha abaixo para fechar a sessão
    session.close()

    return jsonify({'results': dict_results, 'page': pagina, 'num_pages': num_paginas})


@app.route('/insert_prestacion', methods=['POST'])
def insert_prestacion():
    data = request.get_json()
    IdCatalogo = data['IdCatalogo']
    IdPrestacion = data['IdPrestacion']
    IdFamilia = data['IdFamilia']
    IdSubFamilia = data['IdSubFamilia']
    Descripcion = data['Descripcion']
    UnidadMedida = data['UnidadMedida']
    Duracion = data['Duracion']
  
    Activo = 1

     

    try:
        session = Session()
        new_prestacion = Prestacion(IdCatalogo, IdPrestacion, IdFamilia, IdSubFamilia,Activo,Descripcion,UnidadMedida,Duracion)
        session.add(new_prestacion)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_prestacion', methods=['POST'])
def update_familia():
    data = request.get_json()
    newIdFamilia = data['newIdFamilia']
    newDescripcion = data['newDescripcion']
    newServicio = data['newServicio']
    newCodTipo = data['newCodTipo']

    oldIdFamilia = data['oldIdFamilia']
    oldDescripcion = data['oldDescripcion']
    oldServicio = data['oldServicio']
    oldCodTipo = data['oldCodTipo']
    Activo = 1
    try:
        session = Session()
        familia = session.query(Familia).filter(
            and_(
                Familia.IdFamilia == oldIdFamilia,
                text("convert(varchar, Descripcion) = :desc").params(desc=oldDescripcion),
                Familia.Servicio == oldServicio,
                Familia.CodTipo == oldCodTipo
            )
        ).first()

        if familia:
            familia.IdFamilia = newIdFamilia
            familia.Descripcion = newDescripcion
            familia.Servicio = newServicio
            familia.CodTipo = newCodTipo
            familia.Activo = Activo
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete_prestacion', methods=['POST'])
def delete_familia():
    data = request.get_json()
    delPrestacion = data['delPrestacion']
    delFamilia = data['delFamilia']
    delSubFamilia = data['delSubFamilia']
    Activo = 1

    try:
        session = Session()
        prestacion = session.query(Prestacion).filter(
            and_(
                Prestacion.IdPrestacion == delPrestacion,
                Prestacion.IdFamilia == delFamilia,
                Prestacion.IdSubFamilia == delSubFamilia,
                Prestacion.Activo == Activo
            )
        ).first()

        if prestacion:
            session.delete(prestacion)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
