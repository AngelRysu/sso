import { Request, Response } from 'express';
import * as service from '../services/aplicaciones';
import { Exception } from '../model/Exception';
import { Aplicacion } from '../types';

export const getAplicacion = async (req: Request, res: Response): Promise<any> => {
    const { idAplicacion } = req.params;
    try {
        const response: Aplicacion | undefined = await service.getAplicacion(idAplicacion);
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


export const getAplicaciones = async (req: Request, res: Response): Promise<any> => {
    const { filtros, orden, limite, pagina } = req.body;
    try {
        const response: Aplicacion[] | undefined = await service.getAplicaciones(filtros, orden, limite, pagina);
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

export const deleteAplicacion = async (req: Request, res: Response): Promise<any> => {
    const { idAplicacion } = req.params;
    const idAplicaciones = idAplicacion.split(',').map(Number);
    try {
        const affectedRows: number = await service.deleteAplicaciones(idAplicaciones);
        return res.status(204).json({ 'affectedRows': affectedRows });
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};
export const insertAplicacion = async (req: Request, res: Response): Promise<any> => {
    const { clave, nombre, redireccion } = req.body;
    try {
        const response: Aplicacion | undefined = await service.insertAplicacion(clave, nombre, redireccion);
        return res.status(201).json(response);
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};


export const updateAplicacion = async (req: Request, res: Response): Promise<any> => {
    const { idAplicacion } = req.params;
    const { clave, nombre, redireccion } = req.body;
    try {
        const response: Aplicacion | undefined = await service.updateAplicacion(idAplicacion, clave, nombre, redireccion);
        return res.status(204).json(response);
    } catch (error: any) {
        return res.status(500).json({
            code: error instanceof Exception ? error.code : 500,
            message: error.message || 'Error interno del servidor',
        });
    }
};

export const getDescarga = async (_req: Request, res: Response): Promise<void> => {
    try {
        const contenidoCSV = await service.generarCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="aplicaciones.csv"');
        res.status(200).send(contenidoCSV);
    } catch (error: any) {
        console.error('Error en getDescarga:', error.message || error);
        res.status(500).json({
            message: error.message || 'Error interno del servidor',
        });
    }
};