const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db")
const ayarlar = require("./ayarlar.json");
const { Client, Util } = require("discord.js");
const fs = require("fs");
require("./util/eventLoader")(client);
require('discord-buttons')(client);

//Deneme
const log = message => {
  console.log(`${message}`);
};



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.on('ready', async () => {
client.user.setStatus('idle');
client.user.setActivity("HydroGEN - Başvuru	", {
  type: "STREAMING",
  url: "https://www.twitch.tv/hydrogenhd88"
});
console.log(`${client.user.username} ismiyle bağlandım.`);
})




const disbut = require('discord-buttons');
client.on('clickButton', async (button) => {

  const onybuton = new disbut.MessageButton()
    .setLabel('Onaylandı')
    .setStyle('green')
    .setID('ony')
    .setDisabled();

    const onaymsj = new Discord.MessageEmbed()
    .setAuthor('HydroGEN - Başvuru', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`Başvurunuz Onaylandı ve Yetkili Rolleriniz verildi, Tebrikler :)`)
    .setColor('GREEN');



    const data = await db.get(`basvur.${button.message.id}`)
    if(!data) return;
  const basvuruGonderenID = data;

  if(button.id === 'onay'){
    button.reply.defer()
	const isimdes = client.users.cache.get(basvuruGonderenID);
    await button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu \`${button.clicker.user.tag}\` isimli yetkili tarafından Kabul edildi`, onybuton)
    await client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, onaymsj)
    await client.guilds.cache.get(ayarlar.sunucuid).members.cache.get(basvuruGonderenID).roles.add(ayarlar.yetkilirolid)
	isimdes.send('Hey Selam! Ben HydroGEN - Başvuru :wave: \nYaptığın yetkili başvurusu onaylandı öncelikle tebrik ederim artık yetkili ekibimizdensin. :partying_face: \nAncak bazı görevlerin olucak alta bunları anlatımcam iyi dinle olur mu :slight_smile: \n\n\n **1 -** <#874742022903308338> Kanalında Aktif Bir Şekilde Çalışmak <#874742017333264595> Bir Kez Daha Okumanı Tavsiye Ederim.\nAbone Rol Verme Komutu = !a <@kullanıcı>\nEğer Yanlışıkla Verirsen !a-al <@kullanıcı>\n\n**2 -** <#874742026762080306> Bildiğin Hatalar Varsa Yardım Edebilirsin.\n\n**3 -** <#755298820182638692> Kanalını Oku Kurala Bile Uymadığın Zaman sende üyeler gibi ceza yiyebilirsin.\n\n**4 -** <#874743904799449108> Kanalınıda Okumayı Tavsiye Ederiz Aynı Şekilde Uymassan Yetkin Gidebilir vb.\n\n**5 **- <#874749694906093578> Her Etiket Geldiğinde Bakman Senin İçin İyi Olabilir Arada Toplantılar Olabilir Eğer Zorunlu olan Toplantılara Gelmezsen Destek Ekibinden Atılırsın.\n\n\n **Evet ama hep böyle sıkı yönetim mi var hep çalışmak mı var?**\nTabikide hayır. Arasıra yetkili ekibimiz arasında oynadığımız eğlenceli vakitlerde oluyor, birlikte oyunlar oynar şakalaşırız. Hatta çoğu yetkililerimiz  videolarda bile çıktı :) \n\n **Gelelim Ektiğimizi Biçmeye**\nAktif ve Düzenli Çalışmanın ardından tabikide ödüller var eğer kendini gösterirsen sırasıyla yetkin yükselicek ve daha üst konumlarda görev alıcaksın. \n O zaman Şimdiden kolay gelsin :) HydroGENDegilim Yetkili Ekibine Hoş Geldin :heart:')
  }
  if(button.id === 'red'){
    button.reply.defer()


    const sorular = [
      '**Reddedilme Sebebi?** <cevap vermek için 3 dakikan var>'
    ]
    let sayac = 0
    
    const filter = m => m.author.id === button.clicker.user.id
    const collector = new Discord.MessageCollector(button.channel, filter, {
      max: sorular.length,
      time: 3000 * 60
    })

    button.channel.send(sorular[sayac++])
    collector.on('collect', m => {
      if(sayac < sorular.length){
        m.channel.send(sorular[sayac++])
      }
    })


    collector.on('end', collected => {
      if(!collected.size) return button.channel.send('**Süre Bitti!**');
      button.channel.send('**Başvurunuz Başarıyla Reddedildi.**');

           
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddedildi')
    .setStyle('red')
    .setID('red')
    .setDisabled();

    const redmsg = new Discord.MessageEmbed()
    .setAuthor('🎄Sparta', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`<@${basvuruGonderenID}> Başvurunuz, \`${collected.map(m => m.content).slice(0,1)}\` nedeniyle ${button.clicker.user} tarafından Reddedildi`)
    .setColor('RED');

     button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu, \`${collected.map(m => m.content).slice(0,1)}\` Sebebiyle, \`${button.clicker.user.tag}\` isimli yetkili tarafından Başarıyla Reddedildi`, redbuton)
     client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, redmsg)
          })

    
  }
  db.delete(`basvuru.${button.message.id}`)

});

client.login(ayarlar.token);



