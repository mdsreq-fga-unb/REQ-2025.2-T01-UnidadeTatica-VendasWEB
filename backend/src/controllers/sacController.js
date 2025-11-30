import { gerarLinkWhatsapp } from "../services/sacService.js";

export async function abrirSac(req, res) {
    try {
        const mensagem = req.query.mensagem; // opcional
        const link = gerarLinkWhatsapp(mensagem);

        return res.status(200).json({
            status: "ok",
            whatsapp_link: link
        });
    } catch (error) {
        return res.status(500).json({
            error: "Erro ao gerar link do SAC"
        });
    }
}
