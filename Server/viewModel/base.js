class baseModel {

    save(data) {
        var ins = new this.model(data);
        ins.save();
    }

    find(params) {

        this.model.find(params, function (err, docs) {

        });
    }

    remove(params) {
        
        this.model.remove(params, function (error, docs) {

        });
    }

}

exports = module.exports = baseModel;