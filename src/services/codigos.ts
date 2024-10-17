import { ssoDB } from '../model/Connection';
import { queries } from '../queries/codigos';
import { Exception } from '../model/Exception';
import { QueryBuilder } from '../model/QueryBuilder';
import Mail from '../model/Mail'

export const getCodigo = async (idCodigo: string) => {
    try {
        const [result]: any = await ssoDB.query(queries.getCodigo, [idCodigo]);
        if( result.length > 0 ){
            return result[0];
        }else{
            return undefined;
        }
    } catch (error : any) {
        throw new Exception(error.message, error);
    }
}

export const getCodigos = async ( filtros: string | undefined, orden: string | undefined, limite: number | undefined, pagina: number | undefined ) => {
    try {
        const [result]: any = await ssoDB.query( QueryBuilder.getQuery( queries.getCodigos, filtros, orden, limite, pagina ) );
        if( result.length > 0 ){
            return result;
        }else{
            return undefined;
        }
    } catch (error: any) {
        throw new Exception(error.message, error);
    }
}

export const insertCodigo = async ( idCredencial: string, tipo: string, medio: string, destinatario: string  ) => {
    try {
        const [result]: any = await ssoDB.query( queries.insertCodigo, [idCredencial, tipo, medio ]);
        if( medio === 'Correo' ){
            const mail = new Mail();
            let asunto = '';
            let contenido = '';
            if( tipo === 'Validación' ){
                asunto = 'Código de validación'
                contenido = `El código de validación es: ${result[0][0].clave }`
            }
            mail.enviarCorreo( destinatario, asunto , contenido );
        }
        if( medio === 'Celular' ){
            // Anexar el codigo de uso para whatsapp business
        }
        return result[0][0];
    } catch (error: any ) {
        throw new Exception(error.message, error);
    }
}
