import { Request, Response } from 'express';
import * as service from '../services/perfiles';
import { Exception } from '../model/Exception';
import { Perfil } from '../types';

export const getPerfil = async (req: Request, res: Response): Promise<any> => {

    const { idCredencial } = req.params;
    try {
        const response: Perfil | undefined = await service.getPerfil( idCredencial );
        if (response) {
            return res.status(200).json(response);
        }
        return res.status(204).json({});
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};

export const getPerfiles = async (req: Request, res: Response): Promise<any> => {

    const { filtros, orden, limite, pagina } = req.body;
    try {
        const response: Perfil[] | undefined = await service.getPerfiles( filtros, orden, limite, pagina );
        if (response && response.length > 0) {
            return res.status(200).json(response);
        }
        return res.status(204).json({});
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};

export const deletePerfil = async (req: Request, res: Response): Promise<any> => {

    const { idRol } = req.params;
    const { idCredencial } = req.body;
    try {
        const affectedRows: number =  await service.deletePerfil( idRol, idCredencial );
        return res.status(204).json({ 'affectedRows': affectedRows});
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};

export const upsertPerfil = async (req: Request, res: Response): Promise<void> => {
    const { idCredencial } = req.params;
    const perfiles = req.body;

    try {
        const responses = [];
        for (const perfil of perfiles) {
            const { seleccionado, idRol } = perfil;
            const result = await service.upsertPerfil(seleccionado, idRol, idCredencial);
            responses.push(result);
        }
        res.status(200).json(responses);
    } catch (error: any) {
        console.error("Error en upsertPerfil:", error);
        res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || "Error interno del servidor",
        });
    }
};