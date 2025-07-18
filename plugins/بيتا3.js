import { generateWAMessageFromContent } from 'baileys';

let handler = async (m, { conn }) => {
    const interactiveMessage = {
        header: {
            title: `*❃ ───────⊰ ❀ ⊱─────── ❃*

◆┋استمارات إداريـة┋◆

*❃ ───────⊰ ❀ ⊱─────── ❃*

⚜︎┊استمارة *تغيير اللقب* اطلب 
✧بيتا ا1
    
❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *الانذار* اطلب 
✧بيتا ا2

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *طرد* اطلب 
✧بيتا ا3

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تحويل بيلي* اطلب 
✧بيتا ا4

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *ازاله انذار* اطلب 
✧بيتا ا5
  
❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *شراء* اطلب 
✧بيتا ا6
  
❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *ترقية* اطلب 
✧بيتا ا7

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تخفيض* اطلب 
✧بيتا ا8

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *حجز لقب* اطلب 
✧بيتا ا9

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *مهام المشرفين* اطلب 
✧بيتا ا10

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تقييم المشرفين* اطلب 
✧بيتا ا11

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *ملوك الاسبوع* اطلب 
✧بيتا ا12

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تقرير النقابه* اطلب 
✧بيتا ا13

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *التفاعل الاسبوعي* اطلب 
✧بيتا ا14

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *ملوك المسابقات* اطلب 
✧بيتا ا15

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊ استمارة *روليت* اطلب 
✧بيتا ا16

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *ارسال رساله بالاعلانات* اطلب 
✧بيتا ا17

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *اعلان سلعه قتاليه* اطلب 
✧بيتا ا18

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *اعلان الإداره العليا* اطلب 
✧بيتا ا19

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *المهام الاساسيه* اطلب
✧بيتا ا20

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تحديث البنك* اطلب
✧بيتا ا21

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *تفاعل المشرفين* اطلب
✧بيتا ا22

❃ ───────⊰ ❀ ⊱─────── ❃

⚜︎┊استمارة *نظام التقييم* اطلب
✧بيتا ا23

*❃ ───────⊰ ❀ ⊱─────── ❃*

*⚜︎  ┃ادارة•* ﹝𝑺𝒑𝒂𝒓𝒕𝒂﹞
`,
        },
        body: {
            text: '*❃ ───────⊰ ❀ ⊱─────── ❃*\n',
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '❀ الاقسام ❀',
                        sections: [
                            {
                                title: 'الاستمارات',
                                highlight_label: 'آرثر',
                                rows: [
                                    { header: '❀ تغيير اللقب ❀', title: 'بيتا ا1', id: '.بيتا_ا1' },
                                    { header: '❀ الانذار ❀', title: 'بيتا ا2', id: '.بيتا_ا2' },
                                    { header: '❀ طرد ❀', title: 'بيتا ا3', id: '.بيتا_ا3' },
                                    { header: '❀ تحويل بيلي ❀', title: 'بيتا ا4', id: '.بيتا_ا4' },
                                    { header: '❀ ازاله انذار ❀', title: 'بيتا ا5', id: '.بيتا_ا5' },
                                    { header: '❀ شراء ❀', title: 'بيتا ا6', id: '.بيتا_ا6' },
                                    { header: '❀ ترقية ❀', title: 'بيتا ا7', id: '.بيتا_ا7' },
                                    { header: '❀ تخفيض ❀', title: 'بيتا ا8', id: '.بيتا_ا8' },
                                    { header: '❀ حجز لقب ❀', title: 'بيتا ا9', id: '.بيتا_ا9' },
                                    { header: '❀ مهام المشرفين ❀', title: 'بيتا ا10', id: '.بيتا_ا10' },
                                    { header: '❀ تقييم المشرفين ❀', title: 'بيتا ا11', id: '.بيتا_ا11' },
                                    { header: '❀ ملوك الاسبوع ❀', title: 'بيتا ا12', id: '.بيتا_ا12' },
                                    { header: '❀ تقرير النقابه ❀', title: 'بيتا ا13', id: '.بيتا_ا13' },
                                    { header: '❀ التفاعل الاسبوعي ❀', title: 'بيتا ا14', id: '.بيتا_ا14' },
                                    { header: '❀ ملوك المسابقات ❀', title: 'بيتا ا15', id: '.بيتا_ا15' },
                                    { header: '❀ روليت ❀', title: 'بيتا ا16', id: '.بيتا_ا16' },
                                    { header: '❀ ارسال رساله بالاعلانات ❀', title: 'بيتا ا17', id: '.بيتا_ا17' },
                                    { header: '❀ اعلان سلعه قتاليه ❀', title: 'بيتا ا18', id: '.بيتا_ا18' },
                                    { header: '❀ اعلان الإداره العليا ❀', title: 'بيتا ا19', id: '.بيتا_ا19' },
                                    { header: '❀ المهام الاساسيه ❀', title: 'بيتا ا20', id: '.بيتا_ا20' },
                                    { header: '❀ تحديث البنك ❀', title: 'بيتا ا21', id: '.بيتا_ا21' },
                                    { header: '❀ تفاعل المشرفين ❀', title: 'بيتا ا22', id: '.بيتا_ا22' },
                                    { header: '❀ نظام التقييم ❀', title: 'بيتا ا23', id: '.بيتا_ا23' },
                                ],
                            },
                        ],
                    }),
                    messageParamsJson: '',
                },
            ],
        },
    };

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        },
        { userJid: conn.user.jid, quoted: m }
    );

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['بيتا3'];

export default handler;
