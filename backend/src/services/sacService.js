export function gerarLinkWhatsapp(msg) {
    const phone = process.env.ADMIN_WHATSAPP;
    const defaultMsg = msg || process.env.DEFAULT_MESSAGE;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(defaultMsg)}`;
}
