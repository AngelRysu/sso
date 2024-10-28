import { Request, Response } from 'express';
import * as service from '../services/sesiones';
import { Exception } from '../model/Exception';

export const getSesion = async (req: Request, res: Response): Promise<any> => {
    const { curp, correo, celular, contrasena } = req.body;
    const X_API_KEY = req.headers['api_key'] as string | undefined;
    try {
        if (X_API_KEY !== process.env.X_API_KEY) {
            throw new Exception('401', 'Falta api-key');
        }
        const response = await service.getSesion(curp, correo, celular, contrasena);
        if (response?.statusCode === 200) {
            res.status(200).json({ token: response.token });
        } else if (response?.statusCode === 202) {
            res.status(202).json({
                message: response.message,
                actionRequired: response.actionRequired,
                validationNeeded: response.validationNeeded,
                authenticationNeeded: response.authenticationNeeded,
            });
        } else {
            res.status(204).json({});
        }
    } catch (error: any) {
        if (error instanceof Exception) {
            return res.status(parseInt(error.code)).json({ code: error.code, message: error.message });
        }
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

export const deleteSesion = async (req: Request, res: Response): Promise<any> => {

    const { _idCredencial } = req.params;
    try {
        await service.deleteSession( _idCredencial );
        res.status(204).json({});
    } catch (error: any) {
        res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor'
        });
    }
};

export const setPassword = async (req: Request, res: Response): Promise<any> => {
    const { idCredencial } = req.params;
    const { contrasena } = req.body;
    try {
        await service.setPassword( idCredencial, contrasena);
        res.status(204).json({});
    } catch (error: any) {
        res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor'
        });
    }
};


