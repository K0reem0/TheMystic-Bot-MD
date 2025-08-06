const handler = async (m, { conn, isROwner, text }) => {  
  if (!process.send) throw '❌ لا يمكن إعادة تشغيل البوت من هذا الوضع.';  
  
  await m.reply('🔄 يتم الآن إعادة تشغيل البوت...');  
  process.send('reset');  
};  

handler.help = ['restart'];  
handler.tags = ['owner'];  
handler.command = ['ريستارت', 'reiniciar'];  
handler.rowner = true;  

export default handler;
