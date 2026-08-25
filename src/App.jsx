import { useEffect, useRef, useState } from 'react'
import './App.css'
import './Details.css'
import './HubMotion.css'
import './Brand.css'
import './Polish.css'
import './TrailerPolish.css'
import './Hero.css'
import './BrandLanding.css'
import './ProfilePicker.css'
import './TitleExperience.css'

const hubs = [['DISNEY','Stories for every generation','disney','/brand/disney.svg'],['PIXAR','Animation & imagination','pixar','/brand/pixar.svg'],['MARVEL','Heroes, legends & more','marvel','/brand/marvel.svg'],['STAR WARS','A galaxy of stories','wars','/brand/star-wars.svg'],['NATIONAL GEOGRAPHIC','Explore the world','natgeo','/brand/national-geographic.svg']]
const rows = [['Recommended for you',['Skybound','The Last Signal','Beyond the Reef','Dream Atlas','Orbit']],['New to Disney+',['Wild Frontier','Blue Hour','Hidden Earth','Neon City','Sunrise Club']]]
const art = ['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1519608487953-e999c86e7452?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=900&q=85']
const excludedTitles = new Set(['Tagesschau','The Tonight Show Starring Jimmy Fallon','Watch What Happens Live with Andy Cohen','Paradise Hotel'])
const disneySkyDots = [{x:'7%',y:'13%',s:2,d:'0s'},{x:'13%',y:'31%',s:3,d:'1.4s',t:true},{x:'19%',y:'19%',s:2,d:'3s'},{x:'24%',y:'48%',s:2,d:'4.5s'},{x:'31%',y:'11%',s:3,d:'2.1s',t:true},{x:'37%',y:'28%',s:2,d:'5s'},{x:'42%',y:'42%',s:3,d:'1s'},{x:'48%',y:'16%',s:2,d:'3.7s'},{x:'54%',y:'30%',s:2,d:'2.7s'},{x:'58%',y:'9%',s:3,d:'5.4s',t:true},{x:'65%',y:'40%',s:2,d:'1.6s'},{x:'70%',y:'19%',s:2,d:'4.2s'},{x:'74%',y:'49%',s:3,d:'3.3s',t:true},{x:'79%',y:'11%',s:2,d:'0.8s'},{x:'92%',y:'37%',s:2,d:'4.8s'},{x:'96%',y:'20%',s:3,d:'2.5s',t:true},{x:'4%',y:'62%',s:2,d:'3.6s'},{x:'17%',y:'67%',s:2,d:'5.8s'},{x:'28%',y:'58%',s:3,d:'1.8s',t:true},{x:'46%',y:'62%',s:2,d:'4.4s'},{x:'61%',y:'58%',s:2,d:'2.9s'},{x:'72%',y:'68%',s:2,d:'0.5s'},{x:'94%',y:'62%',s:2,d:'3.1s'}]
function toTitle(item){return {id:`${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}`,tmdbID:item.id,type:item.media_type || (item.title ? 'movie' : 'tv'),title:item.title || item.name,year:(item.release_date || item.first_air_date || 'New').slice(0,4),overview:item.overview,image:item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : art[0],poster:item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : art[0]}}

function HeroMedia({titles,openTitle,toggleList}){
 const [slide,setSlide]=useState(0)
 const [media,setMedia]=useState(null)
 const [soundOn,setSoundOn]=useState(false)
 const trailerFrame=useRef(null)
 const title=titles[slide%titles.length]
 useEffect(()=>{if(titles.length<2)return;const timer=window.setInterval(()=>setSlide(current=>(current+1)%titles.length),75000);return()=>window.clearInterval(timer)},[titles.length])
 useEffect(()=>{if(!title)return;setMedia(null);setSoundOn(false);const kind=title.type==='tv'?'tv':'movie';fetch(`/api/tmdb?path=${encodeURIComponent(`/${kind}/${title.tmdbID}?append_to_response=videos,images`)}`).then(response=>response.json()).then(setMedia).catch(()=>{})},[title])
 const trailer=media?.videos?.results?.find(video=>video.site==='YouTube'&&video.type==='Trailer')
 const logo=media?.images?.logos?.find(image=>image.iso_639_1==='en')||media?.images?.logos?.[0]
 const move=direction=>setSlide(current=>(current+direction+titles.length)%titles.length)
 const trailerUrl=trailer?`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${soundOn?0:1}&controls=0&rel=0&cc_load_policy=0&iv_load_policy=3&disablekb=1&enablejsapi=1&playsinline=1`:''
 const startSound=()=>{const player=trailerFrame.current?.contentWindow;if(player){player.postMessage(JSON.stringify({event:'command',func:'unMute',args:[]}),'*');player.postMessage(JSON.stringify({event:'command',func:'setVolume',args:[100]}),'*');player.postMessage(JSON.stringify({event:'command',func:'playVideo',args:[]}),'*')}setSoundOn(true)}
 return <section className="plus-hero" id="home" style={trailer?undefined:{backgroundImage:`linear-gradient(90deg,#040714 10%,rgba(4,7,20,.67) 44%,rgba(4,7,20,.05)),url(${title?.image||art[0]})`}}>{trailer&&<iframe ref={trailerFrame} className="hero-trailer" title={`${title.title} trailer`} src={trailerUrl} allow="autoplay; encrypted-media"/>}<div className="hero-shade"/><div className="plus-hero-copy"><p className="eyebrow">DISNEY+ FEATURED</p>{logo?<img className="hero-title-logo" src={`https://image.tmdb.org/t/p/w500${logo.file_path}`} alt={title.title}/>:<div className="hero-title-loading" aria-label="Loading featured title"/>}<p className="hero-meta">{title?.year||'2024'} · Family · Adventure</p><p>{title?.overview||'Moana answers the call of the ocean and sets sail with Maui on an unforgettable journey across the seas of Oceania.'}</p><button className="watch" onClick={()=>openTitle(title)}>▶ WATCH NOW</button>{trailer&&<button className="sound-toggle" onClick={startSound}>{soundOn?'🔊 RESTART SOUND':'🔇 TURN SOUND ON'}</button>}<button className="add" onClick={()=>toggleList(title)} aria-label="Add featured title to My List">＋</button></div>{titles.length>1&&<div className="hero-carousel" aria-label="Featured trailers"><button onClick={()=>move(-1)} aria-label="Previous trailer">‹</button><div>{titles.map((item,index)=><button className={index===slide?'active':''} key={item.id} onClick={()=>setSlide(index)} aria-label={`Show ${item.title}`}/>)}</div><button onClick={()=>move(1)} aria-label="Next trailer">›</button></div>}</section>
}

export default function App(){
 const [menu,setMenu]=useState(false); const [active,setActive]=useState(''); const [liveRows,setLiveRows]=useState([]); const [selected,setSelected]=useState(null); const [myList,setMyList]=useState(()=>JSON.parse(localStorage.getItem('disney-plus-my-list')||'[]')); const [route,setRoute]=useState(()=>window.location.hash.replace(/^#\/?/,'')||'home'); const [profileOpen,setProfileOpen]=useState(false); const [signedOut,setSignedOut]=useState(false)
 useEffect(()=>{
  const paths=['/discover/movie?with_companies=2&sort_by=popularity.desc','/discover/movie?with_companies=2&sort_by=primary_release_date.desc','/discover/tv?with_networks=2739&sort_by=popularity.desc','/discover/movie?with_companies=420&sort_by=popularity.desc','/discover/movie?with_companies=3&sort_by=popularity.desc','/discover/movie?with_companies=1&sort_by=popularity.desc','/discover/tv?with_networks=43&sort_by=popularity.desc','/discover/movie?with_companies=2&sort_by=popularity.desc']
  Promise.all(paths.map(path=>fetch(`/api/tmdb?path=${encodeURIComponent(path)}`).then(response=>response.json())))
   .then(([trending,movies,series,marvel,pixar,starwars,natgeo,disney])=>setLiveRows([
    ['Recommended for you',trending.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['New to Disney+',movies.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['Marvel Studios',marvel.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['Pixar favorites',pixar.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['Star Wars saga',starwars.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['Disney stories',disney.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['National Geographic',natgeo.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)],
    ['Binge-worthy series',series.results.filter(item=>!excludedTitles.has(item.title||item.name)).slice(0,8).map(toTitle)]
   ]))
   .catch(()=>{})
 },[])
 useEffect(()=>{const onRouteChange=()=>setRoute(window.location.hash.replace(/^#\/?/,'')||'home');window.addEventListener('hashchange',onRouteChange);return()=>window.removeEventListener('hashchange',onRouteChange)},[])
 useEffect(()=>localStorage.setItem('disney-plus-my-list',JSON.stringify(myList)),[myList])
 const heroTitles=liveRows.find(([label])=>label==='Disney stories')?.[1]?.filter(item=>item.title!=='The Lion King').slice(0,5)||[{id:'movie-1108427',tmdbID:1108427,title:'Moana',year:'2024',overview:'Moana answers the call of the ocean and sets sail with Maui on an unforgettable journey across the seas of Oceania.',image:art[0],type:'movie'}]
 const toggleList=title=>setMyList(list=>list.some(item=>item.id===title.id)?list.filter(item=>item.id!==title.id):[...list,title])
 const catalogRows=liveRows.length?liveRows:rows
 const allTitles=catalogRows.flatMap(([,items])=>items.filter(item=>typeof item!=='string'))
 const routeTitle=route.startsWith('title/')?allTitles.find(item=>item.id===route.slice(6))||selected:null
 const brand=route.startsWith('brand/')?route.slice(6):''
 const page=route.startsWith('title/')?'title':brand?'brand':route
 const openTitle=title=>{setSelected(title);window.location.hash=`/title/${title.id}`}
 const closeTitle=()=>{setSelected(null);window.location.hash='/home'}
 const brandRows={disney:'Disney stories',pixar:'Pixar favorites',marvel:'Marvel Studios',wars:'Star Wars saga',natgeo:'National Geographic'}
 const brandInfo={disney:{slug:'disney',name:'Disney',logo:'/brand/disney.svg',tagline:'Timeless stories for every generation.'},pixar:{slug:'pixar',name:'Pixar',logo:'/brand/pixar.svg',tagline:'Imagination has no limits.'},marvel:{slug:'marvel',name:'Marvel Studios',logo:'/brand/marvel.svg',tagline:'Heroes. Legends. Marvel stories.'},wars:{slug:'wars',name:'Star Wars',logo:'/brand/star-wars.svg',tagline:'Explore a galaxy of stories.'},natgeo:{slug:'natgeo',name:'National Geographic',logo:'/brand/national-geographic.svg',tagline:'Explore the world through extraordinary stories.'}}
 const pageTitle=page==='brand'?brandInfo[brand]?.name:page
 const visibleRows=page==='brand'?catalogRows.filter(([title])=>title===brandRows[brand]):page==='movies'?catalogRows.filter(([title])=>['New to Disney+','Marvel Studios','Pixar favorites','Star Wars saga','Disney stories'].includes(title)):page==='series'?catalogRows.filter(([title])=>['Binge-worthy series','National Geographic'].includes(title)):page==='originals'?catalogRows.filter(([title])=>['Recommended for you','Disney stories','National Geographic'].includes(title)):catalogRows
 if(signedOut)return <main className="plus-app signed-out"><section><img src="/brand/disney-plus-logo.svg" alt="Disney+"/><h1>Welcome back</h1><p>This portfolio demo is guest-friendly—no email, password, or account is required.</p><button className="watch" onClick={()=>setSignedOut(false)}>CONTINUE AS GUEST</button></section></main>
 if(routeTitle&&page==='title')return <TitleDetails title={routeTitle} close={closeTitle} toggleList={toggleList} inList={myList.some(item=>item.id===routeTitle.id)}/>
 return <main className="plus-app">
  <header className="plus-nav"><a className="disney-logo" href="#/home" aria-label="Disney Plus home"><img src="/brand/disney-plus-logo.svg" alt="Disney+" /></a><nav className={menu?'open':''}><a className={page==='home'?'current':''} href="#/home">HOME</a><a className={page==='originals'?'current':''} href="#/originals">ORIGINALS</a><a className={page==='movies'?'current':''} href="#/movies">MOVIES</a><a className={page==='series'?'current':''} href="#/series">SERIES</a><a className={page==='watchlist'?'current':''} href="#/watchlist">MY LIST</a></nav><div className="profile-picker"><button className="profile" onClick={()=>setProfileOpen(open=>!open)} aria-expanded={profileOpen} aria-label="Open account menu"><span className="nav-mickey" aria-hidden="true"><i /></span></button>{profileOpen&&<div className="account-menu"><strong>Guest viewer</strong><span>No sign-in required</span><button onClick={()=>setSignedOut(true)}>Log out</button></div>}</div><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Open navigation">☰</button></header>
  {page==='home'&&<HeroMedia titles={heroTitles} openTitle={openTitle} toggleList={toggleList}/>} 
  {page==='home'&&<section className="hub-row" aria-label="Disney Plus brands">{hubs.map(([name,tag,style,logo])=><button key={name} className={`hub-card ${style} ${active===name?'selected':''}`} onClick={()=>{setActive(name);window.location.hash=`/brand/${style}`}}><img className="hub-logo-image" src={logo} alt={`${name} logo`}/><small>{tag}</small></button>)}</section>}
  {active&&page==='home'&&<p className="hub-message">Explore {active} stories</p>}
  {page==='watchlist'?<section className="content-row"><h2>My List</h2>{myList.length?<div className="poster-row">{myList.map(item=><button className="wide-card" key={item.id} onClick={()=>openTitle(item)}><img src={item.poster||item.image} alt={`${item.title} poster`}/><span>{item.title}</span></button>)}</div>:<p className="empty-list">Use the ＋ button on any title to save it here.</p>}</section>:<>{page==='brand'&&<BrandLanding brand={brandInfo[brand]} feature={visibleRows[0]?.[1]?.[0]} openTitle={openTitle}/>} {page!=='home'&&page!=='brand'&&<section className="browse-heading"><p className="eyebrow">DISNEY+ COLLECTION</p><h1>{pageTitle}</h1></section>}{visibleRows.map(([title,items])=><section className="content-row" key={title}><h2>{title}</h2><div className="poster-row">{items.map((item,index)=>{const name=typeof item==='string'?item:item.title;const image=typeof item==='string'?art[index]:item.poster;return <button className="wide-card" key={name} onClick={()=>typeof item!=='string'&&openTitle(item)}><img src={image} alt={`${name} poster`}/><span>{name}</span></button>})}</div></section>)}</>}
  <footer>© 2026 Disney+ UI portfolio clone · Live catalog powered by TMDB</footer></main>
}

function BrandLanding({brand,feature,openTitle}){
 const landingRef=useRef(null)
 const pixarLightRef=useRef(null)
 useEffect(()=>{
  if(brand?.slug!=='pixar'||!landingRef.current||!pixarLightRef.current)return
  const positionLamp=()=>{
   const box=landingRef.current.getBoundingClientRect()
   const scale=Math.max(box.width/1920,box.height/1080)
   const renderedWidth=1920*scale
   const renderedHeight=1080*scale
   const mobile=window.matchMedia('(max-width: 700px)').matches
   const cropX=mobile?0:(renderedWidth-box.width)/2
   const cropY=(renderedHeight-box.height)/2
   pixarLightRef.current.style.left=`${650*scale-cropX}px`
   pixarLightRef.current.style.top=`${503*scale-cropY}px`
  }
  positionLamp()
  const observer=new ResizeObserver(positionLamp)
  observer.observe(landingRef.current)
  return()=>observer.disconnect()
 },[brand?.slug])
 if(!brand)return null
 return <section ref={landingRef} className={`brand-landing ${brand.slug}`}><div className="studio-intro" aria-hidden="true"><span/><i ref={pixarLightRef}/><b/></div>{brand.slug==='disney'&&<div className="disney-sky-stars" aria-hidden="true"><div className="disney-star-field">{disneySkyDots.map((star,index)=><span key={index} className={`disney-sky-dot${star.t?' twinkle':''}`} style={{'--x':star.x,'--y':star.y,'--size':`${star.s}px`,'--delay':star.d}}/>)}</div><span className="disney-shooting-star"/><i/><span className="disney-small-star"/></div>}<div className="brand-landing-copy">{brand.slug==='marvel'?<div className="marvel-landing-logo"><b>MARVEL</b><span>STUDIOS</span></div>:<img src={brand.logo} alt={`${brand.name} logo`}/>}<p>{brand.tagline}</p>{feature&&<><p className="hero-meta">{feature.year} · Featured collection</p><button className="watch" onClick={()=>openTitle(feature)}>▶ WATCH FEATURED</button></>}</div></section>
}

function TitleDetails({title,close,toggleList,inList}){
 const [details,setDetails]=useState(title)
 const [soundOn,setSoundOn]=useState(false)
 const [season,setSeason]=useState(1)
 const [episodes,setEpisodes]=useState([])
 useEffect(()=>{setSeason(1);setEpisodes([]);const kind=title.type==='tv'?'tv':'movie';fetch(`/api/tmdb?path=${encodeURIComponent(`/${kind}/${title.tmdbID}?append_to_response=videos,images`)}`).then(response=>response.json()).then(data=>setDetails({...title,...data,image:data.backdrop_path?`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`:title.image})).catch(()=>{})},[title])
 useEffect(()=>{if(title.type!=='tv')return;fetch(`/api/tmdb?path=${encodeURIComponent(`/tv/${title.tmdbID}/season/${season}`)}`).then(response=>response.json()).then(data=>setEpisodes(data.episodes||[])).catch(()=>setEpisodes([]))},[title,season])
 const trailer=details.videos?.results?.find(video=>video.site==='YouTube'&&video.type==='Trailer')
 const titleLogo=details.images?.logos?.find(image=>image.iso_639_1==='en')||details.images?.logos?.[0]
 const seasons=(details.seasons||[]).filter(item=>item.season_number>0)
 return <main className="detail-backdrop"><header className="detail-nav"><a className="disney-logo" href="#/home"><img src="/brand/disney-plus-logo.svg" alt="Disney+" /></a><button className="back-button" onClick={close}>← BACK</button></header><article className={`detail-card ${trailer?'has-trailer':''}`}>{trailer?<iframe className="detail-trailer" title={`${details.title||details.name} trailer`} src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=${soundOn?0:1}&controls=0&rel=0&cc_load_policy=0&iv_load_policy=3&disablekb=1&playsinline=1`} allow="autoplay; encrypted-media"/>:<img src={details.image} alt={`${details.title||details.name} artwork`}/>}<div><p className="eyebrow">DISNEY+ {title.type==='tv'?'SERIES':'MOVIE'}</p>{titleLogo?<img className="detail-title-logo" src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`} alt={details.title||details.name}/>:<div className="detail-title-loading" aria-label="Loading title"/>}<p className="detail-meta">{title.year} · {title.type==='tv'?'Series':'Movie'} · {details.genres?.map(genre=>genre.name).join(', ')||'Family entertainment'}</p><p>{details.overview || title.overview || 'Select this title to discover more.'}</p>{trailer&&<><a className="watch" href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">▶ WATCH TRAILER</a><button className="sound-toggle" onClick={()=>setSoundOn(!soundOn)}>{soundOn?'🔊 SOUND ON':'🔇 TURN SOUND ON'}</button></>}<button className="add" onClick={()=>toggleList(title)}>{inList?'✓':'＋'}</button></div></article>{title.type==='tv'&&<section className="episode-section"><div className="episode-heading"><div><p className="eyebrow">EPISODES</p><h2>{details.name||title.title}</h2></div><label>Season <select value={season} onChange={event=>setSeason(Number(event.target.value))}>{seasons.map(item=><option key={item.id} value={item.season_number}>Season {item.season_number}</option>)}</select></label></div>{episodes.length?<div className="episode-list">{episodes.map(episode=><article className="episode-card" key={episode.id}><img src={episode.still_path?`https://image.tmdb.org/t/p/w500${episode.still_path}`:details.image} alt={`Episode ${episode.episode_number}: ${episode.name}`}/><div><span>{episode.episode_number}. {episode.name}</span><p>{episode.overview||'Continue the story in this episode.'}</p></div></article>)}</div>:<p className="episode-loading">Loading season {season} episodes…</p>}</section>}</main>
}
