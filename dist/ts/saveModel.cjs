"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saveModel = (model) => {
    model
        .save()
        .then((doc) => {
        // console.log(doc);
        // res.send({status: "successfullySaved"});
    })
        .catch((err) => console.error(err));
};
// module.exports = { saveModel };
exports.default = saveModel;
//# sourceMappingURL=saveModel.cjs.map