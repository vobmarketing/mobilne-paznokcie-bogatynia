const dialog=document.querySelector('#lightbox');
document.querySelectorAll('.photo').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#large-photo').src=button.dataset.src;document.querySelector('#large-photo').alt=button.querySelector('img').alt;document.querySelector('#photo-title').textContent=button.dataset.title;dialog.showModal()}));
document.querySelector('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const bookingDialog=document.querySelector('#booking-dialog');
// Na telefonach i w przeglądarkach Instagram/Facebook formularz otwiera się jako osobna strona
// (wbudowane przeglądarki aplikacji nie wyświetlają formularza Google w okienku).
const bookingUA=navigator.userAgent||'';
const bookingInApp=/Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Line\/|TikTok|musical_ly|Snapchat|Twitter|Pinterest|; wv\)/i.test(bookingUA);
const bookingSrc=/Instagram/i.test(bookingUA)?'instagram':/FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(bookingUA)?'facebook':'strona';
const bookingUrl=document.querySelector('#booking-frame').dataset.src.replace('src=strona','src='+bookingSrc);
document.querySelectorAll('a[href="#kontakt"]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();
  if(bookingInApp||window.matchMedia('(max-width:700px)').matches){location.href=bookingUrl;return}
  const frame=document.querySelector('#booking-frame');if(!frame.src)frame.src=frame.dataset.src;bookingDialog.showModal();document.body.style.overflow='hidden'}));
document.querySelector('#booking-close').addEventListener('click',()=>bookingDialog.close());
bookingDialog.addEventListener('click',e=>{if(e.target===bookingDialog){const r=bookingDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)bookingDialog.close()}});
bookingDialog.addEventListener('close',()=>{document.body.style.overflow=''});

// Zgoda na cookies analityczne — logika w consent.js (GTM ładuje się tylko po zgodzie)
const cookieBanner=document.querySelector('#cookie-banner');
const cookieDialog=document.querySelector('#cookie-dialog');
const consentApi=window.mpConsent||{get:()=>null,set:()=>{},reset:()=>{}};
cookieBanner.hidden=!!consentApi.get();
document.querySelector('#cookie-ok').addEventListener('click',()=>{consentApi.set('granted');cookieBanner.hidden=true});
document.querySelector('#cookie-no').addEventListener('click',()=>{consentApi.set('denied');cookieBanner.hidden=true});
document.querySelectorAll('.cookie-link').forEach(button=>button.addEventListener('click',()=>cookieDialog.showModal()));
document.querySelector('#cookie-close').addEventListener('click',()=>cookieDialog.close());
document.querySelector('#cookie-reset').addEventListener('click',()=>{consentApi.reset();cookieBanner.hidden=false;cookieDialog.close()});
cookieDialog.addEventListener('click',e=>{if(e.target===cookieDialog){const r=cookieDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)cookieDialog.close()}});
if(location.hash==='#cookies'){try{cookieDialog.showModal()}catch{}}
