(() => {
  const reduced = false;
  const control=document.getElementById('motion-toggle');
  document.documentElement.classList.toggle('motion-paused',reduced);
  if(control){control.textContent=reduced?'Activar animaciones':'Pausar animaciones';control.setAttribute('aria-pressed',String(reduced));control.addEventListener('click',()=>{localStorage.setItem('chamuel-motion',reduced?'active':'paused');location.reload();});}
  const bars=document.querySelector('.dl-skill-items');
  if(bars){
    const fill=()=>{for(const bar of bars.querySelectorAll('.dl-skill-level')){const value=Number(bar.dataset.level),label=bar.querySelector('.dl-skill-level-text');if(reduced){bar.style.width=value+'%';label.textContent=value+'%';continue;}const start=performance.now();const frame=time=>{const elapsed=time-start;const widthEase=.5-Math.cos(Math.PI*Math.min(elapsed/500,1))/2;const countEase=.5-Math.cos(Math.PI*Math.min(elapsed/1300,1))/2;bar.style.width=value*widthEase+'%';label.textContent=Math.round(value*countEase)+'%';if(elapsed<1300)requestAnimationFrame(frame);};requestAnimationFrame(frame);}};
    const observer=new IntersectionObserver(records=>{if(records.some(r=>r.isIntersecting)){fill();observer.disconnect();}},{threshold:.25});observer.observe(bars);
  }
  if (reduced) return;
  const entries = document.querySelectorAll('[data-reveal]');
  for (const el of entries) {
    const animation = el.dataset.reveal;
    const offset = Number(el.dataset.wowOffset) || 80;
    el.classList.add('reveal-wait');
    const observer = new IntersectionObserver(records => {
      if (!records.some(r => r.isIntersecting)) return;
      const names={'dt-fadeInLeft':'sgFadeInLeft','dt-fadeInRight':'sgFadeInRight','dt-fadeInBottom':'sgFadeInBottom','dt-fadeInTop':'sgFadeInTop','dt-fadeIn':'sgFadeIn'};
      el.style.setProperty('animation',`${names[animation]||animation} ${el.dataset.duration || 2000}ms ease ${el.dataset.delay || 0}ms 1 both`,'important');
      el.classList.remove('reveal-wait');
      el.classList.add('animated', animation);
      observer.disconnect();
    }, {rootMargin:`0px 0px -${Math.min(offset, innerHeight/4)}px 0px`, threshold:0});
    observer.observe(el);
  }
  if (window.Lenis) {
    const lenis = new Lenis();
    const frame = time => {lenis.raf(time); requestAnimationFrame(frame);};
    requestAnimationFrame(frame);
    const alignHash=()=>{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)lenis.scrollTo(target,{offset:-90,immediate:true});};
    window.addEventListener('load',alignHash,{once:true});
    window.addEventListener('hashchange',alignHash);
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const target=document.getElementById(a.hash.slice(1));
      if(target){e.preventDefault();lenis.scrollTo(target,{offset:-90});history.replaceState(null,'',a.hash);}
    }));
  }
})();
