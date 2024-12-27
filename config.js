import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
import moment from 'moment-timezone';

global.botnumber = "";
global.confirmCode = "";
global.authFile = `MysticSession`;

// Cambiar a true si el Bot responde a sus comandos con otros comandos.
// Cambiar a false para usar el Bot desde el mismo numero del Bot.
// Error de m.isBaileys marcado como false fix temporal
global.isBaileysFail = false;

global.defaultLenguaje = 'ar';

global.owner = [
  ['966560801636', '👑 AURTHER 👑', true]
];

global.suittag = ['966560801636'];
global.prems = ['966560801636'];

// API
global.BASE_API_DELIRIUS = "https://deliriussapi-oficial.vercel.app";

global.packname = 'AURTHER';
global.author = 'AURTHER';
global.wm = 'AURTHER';
global.titulowm = 'AURTHER';
global.titulowm2 = `AURTHER`;
global.igfg = 'AURTHER';
global.wait = '*_[ ⏳ ] صبر..._*';

/* Uncomment if needed:
global.imagen1 = fs.createReadStream('./src/assets/images/menu/languages/es/menu.png');
global.imagen2 = fs.createReadStream('./src/assets/images/menu/languages/pt/menu.png');
global.imagen3 = fs.createReadStream('./src/assets/images/menu/languages/fr/menu.png');
global.imagen4 = fs.createReadStream('./src/assets/images/menu/languages/en/menu.png');
global.imagen5 = fs.createReadStream('./src/assets/images/menu/languages/ru/menu.png');
*/
global.imagen1 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');
global.imagen2 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');
global.imagen3 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');
global.imagen4 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');
global.imagen5 = fs.readFileSync('./src/assets/images/menu/languages/es/menu.png');

global.mods = [];

//* Git configuration
global.gitConfig = {
  userName: "Aurtherle", // Replace with your Git username
  userEmail: "hatg4179@gmail.com", // Replace with your Git email
};

//* *******Tiempo***************
global.d = new Date(new Date() + 3600000);
global.locale = 'ar';
global.dia = d.toLocaleDateString(locale, { weekday: 'long' });
global.fecha = d.toLocaleDateString('ar', { day: 'numeric', month: 'numeric', year: 'numeric' });
global.mes = d.toLocaleDateString('ar', { month: 'long' });
global.año = d.toLocaleDateString('ar', { year: 'numeric' });
global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
//* ****************************
global.wm2 = `${dia} ${fecha}\nAURTHER`;
global.gt = 'AURTHER';
global.mysticbot = 'AURTHER';
global.channel = 'https://whatsapp.com/channel/0029Vak3oVNISTkBhE5ypj43';
global.md = 'https://whatsapp.com/channel/0029Vak3oVNISTkBhE5ypj43';
global.mysticbot = 'https://whatsapp.com/channel/0029Vak3oVNISTkBhE5ypj43';
global.waitt = '*_[ ⏳ ] صبر..._*';
global.waittt = '*_[ ⏳ ] صبر..._*';
global.waitttt = '*_[ ⏳ ] صبر..._*';
global.nomorown = '966560801636';
global.pdoc = [
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/msword',
  'application/pdf',
  'text/rtf',
];
global.cmenut = '❖––––––『';
global.cmenub = '┊✦ ';
global.cmenuf = '╰━═┅═━––––––๑\n';
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ';
global.dmenut = '*❖─┅──┅〈*';
global.dmenub = '*┊»*';
global.dmenub2 = '*┊*';
global.dmenuf = '*╰┅────────┅✦*';
global.htjava = '⫹⫺';
global.htki = '*⭑•̩̩͙⊱•••• ☪*';
global.htka = '*☪ ••••̩̩͙⊰•⭑*';
global.comienzo = '• • ◕◕════';
global.fin = '════◕◕ • •';
global.botdate = `*[ 📅 ] Fecha:*  ${moment.tz('America/Mexico_City').format('DD/MM/YY')}`;
global.bottime = `*[ ⏳ ] Hora:* ${moment.tz('America/Mexico_City').format('HH:mm:ss')}`;
global.fgif = {
  key: { participant: '0@s.whatsapp.net' },
  message: {
    videoMessage: {
      title: wm,
      h: `Hmm`,
      seconds: '999999999',
      gifPlayback: 'true',
      caption: bottime,
      jpegThumbnail: fs.readFileSync('./src/assets/images/menu/languages/es/menu.png'),
    },
  },
};
global.multiplier = 99;
global.flaaa = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=',
];

// Automatically reload the config file on changes
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'config.js\''));
  import(`${file}?update=${Date.now()}`);
});
