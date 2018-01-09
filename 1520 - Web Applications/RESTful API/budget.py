from flask import Flask, render_template, json, jsonify, make_response, request, abort

app = Flask(__name__)

categories = [
    {
        'id': 1,
        'type': 'Uncategorized',
        'limit': 0.00, 
        'amount_spent': 0.00
    }
]
purchases = [
        {
        'id': 0,
        'category_id': 0,
        'description': 'INIT NOT USED IN ANY CALCULATIONS',
        'date': '1995-12-16', 
        'amount_spent': 0
    }
]

def get_category_by_id(catID):
    return next(category for category in categories if category['id'] == int(catID))

@app.route('/')
def index():
    return render_template('budget.html')

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Resource not found!'}), 404)

@app.errorhandler(409)
def resource_exists(error):
    return make_response(jsonify({'error': error.description}), 409)

@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({'error': 'My bad!'}), 500)

@app.route('/cats', methods=['GET'])
def get_all_categories():
    return jsonify({'categories': categories})

@app.route('/cats/<int:category_id>', methods=['GET'])
def get_category(category_id):
    #category = [category for category in categories if category['id'] == category_id]
    category = get_category_by_id(category_id)
    
    if len(category) == 0:
        abort(404)
    else:
        return jsonify({'category': category[0]})

@app.route('/cats', methods=['POST'])
def post_category():
    if not request.json or not 'type' in request.json:
        abort(404)

    already_added_category = [category for category in categories if category['type'] == request.json['type']]

    if already_added_category:
        abort(409, 'The category name already exists!')
    else: 
        new_category = {
            'id': categories[-1]['id'] + 1,
            'type': request.json['type'],
            'limit': float(request.json['limit']),
            'amount_spent': 0
        }
    
        categories.append(new_category)
        return jsonify({'new_category': new_category}), 201

@app.route('/cats/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    to_delete = [to_delete for to_delete in categories if to_delete['id'] == category_id]

    if len(to_delete) == 0:
        abort(404)
    else:
        for purchase in purchases:
            if purchase['category_id'] == int(category_id):
                purchase['category_id'] = 1
                to_update = get_category_by_id(1)
                to_update['amount_spent'] += purchase['amount_spent']
    
        deleted_as_json = jsonify({'deleted': to_delete[0]['type']})
        categories.remove(to_delete[0])
        return deleted_as_json

@app.route('/purchases', methods=['GET'])
def get_all_purchases():
    return jsonify({'purchases': purchases})

@app.route('/purchases/<int:purchase_id>', methods=['GET'])
def get_purchase(purchase_id):
    purchase = [purchase for purchase in purchases if purchase['id'] == purchase_id]
    
    if len(purchase) == 0:
        abort(404)
    else:
        return jsonify({'purchase': purchase[0]})

@app.route('/purchases', methods=['POST'])
def post_purchase():
    if not request.json or not 'category_id' in request.json:
        abort(400)
    else:
        new_purchase = {
            'id': purchases[-1]['id'] + 1,
            'category_id': int(request.json['category_id']),
            'description': request.json['description'],
            'date': request.json['date'],
            'amount_spent': float(request.json['amount_spent'])
        }

        for category in categories:
            if category['id'] == new_purchase['category_id']:
                category['amount_spent'] += new_purchase['amount_spent']

        purchases.append(new_purchase)
        return jsonify({'new_purchase': new_purchase}), 201

#unused HTTP method
@app.route('/purchases/<int:purchase_id>', methods=['DELETE'])
def delete_task(purchase_id):
    purchase = [purchase for purchase in purchases if purchase['id'] == purchase_id]

    if len(purchase) == 0:
        abort(404)
    purchases.remove(purchase[0])
    return jsonify({'result': True})

######## TO DO ########
# Test     
        
if __name__ == '__main__':
    app.run(debug=True)