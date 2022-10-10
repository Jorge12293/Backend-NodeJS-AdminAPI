const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos}=require('../middlewars/validar-campos');
const { validarJWT } = require('../middlewars/validar_jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos');


const router =Router();

router.get('/',getMedicos);

router.post('/',[
    validarJWT,
    check('nombre','El nombre del medico es necesario').not().isEmpty(),
    check('hospital','El id del hospital debe ser valido').isMongoId,
    validarCampos
],crearMedico);


router.put('/:id',[],actualizarMedico);


router.delete('/:id',borrarMedico);


module.exports=router;

