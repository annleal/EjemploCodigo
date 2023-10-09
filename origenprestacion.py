from flask import request, jsonify
import math
from sqlalchemy import and_,text
from app import app
from conn import OrigenPrestacion,Session




def search_origenprestacion(CodCentro, IdPrestacion, page):
    session = Session()
    registros_por_pagina = 50
    primeiro_registro = (page - 1) * registros_por_pagina

    query = session.query(OrigenPrestacion).filter(
        and_(
            (OrigenPrestacion.CodCentro == CodCentro) if CodCentro else True,
            OrigenPrestacion.IdPrestacion.contains(IdPrestacion) if IdPrestacion else True
        )
    )

    total_registros = query.count()
    num_paginas = math.ceil(total_registros / registros_por_pagina)

    results = query.order_by(OrigenPrestacion.IdPrestacion).offset(primeiro_registro).limit(registros_por_pagina).all()
    session.close()

    return results, num_paginas


@app.route('/search_origenprestacion')
def search_origenprestacion_route():
    data = request.get_json()
    CodCentro = data.get('CodCentro')
    IdPrestacion = data.get('IdPrestacion')
    page = int(request.args.get('page', '1'))

    results, num_paginas = search_origenprestacion(CodCentro, IdPrestacion, page)

    dict_results = []
    for row in results:
        dict_results.append({
            'CodCentro': row.CodCentro,
            'IdAmbito': row.IdAmbito,
            'IdServicio': row.IdServicio,
            'IdPrestacion': row.IdPrestacion
        })

    return jsonify({'results': dict_results, 'page': page, 'num_pages': num_paginas})


@app.route('/insert_origenprestacion', methods=['POST'])
def insert_origenprestacion():
    data = request.get_json()
    CodCentro = data['CodCentro']
    IdAmbito = data['IdAmbito']
    IdServicio = data['IdServicio']
    IdPrestacion = data['IdPrestacion']
    Activo = 1

    try:
        session = Session()
        new_origenprestacion = OrigenPrestacion(CodCentro, IdAmbito, IdServicio, IdPrestacion,Activo)
        session.add(new_origenprestacion)
        session.commit()
        session.close()

        return jsonify({'success': True}), 200

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_origenprestacion', methods=['POST'])
def update_origenprestacion():
    data = request.get_json()
    newCodCentro = data['newCodCentro']
    newIdAmbito = data['newIdAmbito']
    newIdServicio = data['newIdServicio']
    newIdPrestacion = data['newIdPrestacion']

    oldCodCentro = data['oldCodCentro']
    oldIdAmbito = data['oldIdAmbito']
    oldIdServicio = data['oldIdServicio']
    oldIdPrestacion = data['oldIdPrestacion']
    Activo = 1
    try:
        session = Session()
        familia = session.query(OrigenPrestacion).filter(
            and_(
                OrigenPrestacion.CodCentro == oldCodCentro,
                OrigenPrestacion.IdAmbito == oldIdAmbito,
                OrigenPrestacion.IdServicio == oldIdServicio,
                OrigenPrestacion.IdPrestacion == oldIdPrestacion
            )
        ).first()

        if OrigenPrestacion:
            OrigenPrestacion.CodCentro == newCodCentro,
            OrigenPrestacion.IdAmbito == newIdAmbito,
            OrigenPrestacion.IdServicio == newIdServicio,
            OrigenPrestacion.IdPrestacion == newIdPrestacion
            familia.Activo = Activo
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'origenprestacion not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete_origenprestacion', methods=['POST'])
def delete_origenprestacion():
    data = request.get_json()
    delCodCentro = data['delIdFamilia']
    delIdAmbito = data['delDescripcion']
    delIdServicio = data['delServicio']
    delIdPrestacion = data['delCodTipo']
    Activo = 1

    try:
        session = Session()
        origenprestacion = session.query(OrigenPrestacion).filter(
            and_(
                OrigenPrestacion.CodCentro == delCodCentro,
                OrigenPrestacion.IdAmbito== delIdAmbito,
                OrigenPrestacion.IdServicio == delIdServicio,
                OrigenPrestacion.IdServicio == delIdPrestacion,
                OrigenPrestacion.Activo == Activo
            )
        ).first()

        if origenprestacion:
            session.delete(origenprestacion)
            session.commit()
            session.close()

            return jsonify({'success': True}), 200

        else:
            session.close()
            return jsonify({'success': False, 'error': 'Familia not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500
