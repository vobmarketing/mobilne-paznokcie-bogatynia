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

// Opinie klientek: formularz wysyła opinię do Google Apps Script (arkusz „Отзывы” + Telegram).
// Na stronie opinia pojawia się dopiero po sprawdzeniu przez Wiktorię.
const reviewDialog=document.querySelector('#review-dialog');
if(reviewDialog){
  const REVIEW_API='https://script.google.com/macros/s/AKfycbzL65lTR9fE922_jcW5DAC2MRo5wXjzDJ8ZGI3lnoKFQ0jN7CLqcqyyA6AAy_tlslzD/exec';
  const form=document.querySelector('#review-form'),status=document.querySelector('#review-status'),preview=document.querySelector('#review-preview');
  let photo='';
  const say=(t,err)=>{status.textContent=t||'';status.className=err?'error':''};
  const openReview=()=>{reviewDialog.showModal();document.body.style.overflow='hidden'};
  document.querySelectorAll('[data-review-open]').forEach(b=>b.addEventListener('click',openReview));
  document.querySelectorAll('a[href="#opinia"]').forEach(l=>l.addEventListener('click',e=>{e.preventDefault();openReview()}));
  if(location.hash==='#opinia'){document.querySelector('#opinie').scrollIntoView();setTimeout(openReview,300)}
  document.querySelector('#review-close').addEventListener('click',()=>reviewDialog.close());
  reviewDialog.addEventListener('close',()=>{document.body.style.overflow=''});
  reviewDialog.addEventListener('click',e=>{if(e.target===reviewDialog){const r=reviewDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)reviewDialog.close()}});
  const shrink=file=>new Promise((ok,fail)=>{const img=new Image(),u=URL.createObjectURL(file);
    img.onload=()=>{const k=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight)),cv=document.createElement('canvas');
      cv.width=Math.round(img.naturalWidth*k);cv.height=Math.round(img.naturalHeight*k);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);ok(cv.toDataURL('image/jpeg',.85))};
    img.onerror=()=>{URL.revokeObjectURL(u);fail(new Error('img'))};img.src=u});
  form.elements.photo.addEventListener('change',async()=>{photo='';preview.hidden=true;const f=form.elements.photo.files[0];if(!f)return;
    try{photo=await shrink(f);preview.src=photo;preview.hidden=false;say('')}catch(e){form.elements.photo.value='';say('Nie udało się wczytać zdjęcia — wybierz plik JPG lub PNG.',true)}});
  form.addEventListener('submit',e=>{e.preventDefault();const el=form.elements;
    const review={rating:+((form.querySelector('input[name=rating]:checked')||{}).value||0),name:el.name.value.trim(),service:el.service.value,text:el.text.value.trim(),photo,consent:el.consent.checked,website:el.website.value};
    if(!review.rating)return say('Wybierz ocenę — kliknij gwiazdki.',true);
    if(review.name.length<2)return say('Podaj swoje imię.',true);
    if(review.text.length<10)return say('Napisz kilka słów o wizycie.',true);
    if(!review.consent)return say('Zaznacz zgodę na publikację opinii.',true);
    const btn=form.querySelector('button[type=submit]');btn.disabled=true;say('Wysyłam…');
    fetch(REVIEW_API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'review',review})})
      .then(r=>r.json()).then(d=>{if(!d.ok)throw new Error(d.error||'');
        form.innerHTML='<h2>Dziękuję! 💗</h2><p class="review-intro">Twoja opinia dotarła. Bardzo mi miło — do zobaczenia na kolejnej wizycie!</p><button class="button signup-button" type="button" id="review-done">Zamknij <span>×</span></button>';
        document.querySelector('#review-done').addEventListener('click',()=>reviewDialog.close())})
      .catch(err=>{btn.disabled=false;say(err.message&&err.message.length>5?err.message:'Nie udało się wysłać. Sprawdź internet i spróbuj ponownie.',true)})});
}
