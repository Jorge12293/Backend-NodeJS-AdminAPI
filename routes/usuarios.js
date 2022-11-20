/*
Ruta: /api/usuarios
*/
const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos}=require('../middlewars/validar-campos');

const {getUsuarios,crearUsuario,actualizarUsuario,borrarUsuario} = require('../controllers/usuarios');
const { validarJWT, validarAdminRole } = require('../middlewars/validar_jwt');

const router =Router();

router.get('/',validarJWT,getUsuarios);

router.post('/',[
    check('nombre','El nombre es obligatorio.').not().isEmpty(),
    check('password','El password es obligatorio.').not().isEmpty(),
    check('email','El email no es valido.').isEmail(),
    validarCampos,
],crearUsuario);

router.put('/:id',[
    validarJWT,
    validarAdminRole,
    check('nombre','El nombre es obligatorio.').not().isEmpty(),
    check('email','El email no es valido.').isEmail(),
    check('role','El rol es obligatorio.'),
    validarCampos,
],actualizarUsuario);


router.delete('/:id',validarJWT,borrarUsuario);


module.exports=router;

