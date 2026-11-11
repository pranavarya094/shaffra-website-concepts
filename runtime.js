class DCLogic{constructor(p){this.props=p||{};this.state={};}
              setState(u){Object.assign(this.state,typeof u==='function'?u(this.state):u);DC.schedule();}
              forceUpdate(){DC.schedule();}}
const DC={q:false,
          mount(C){this.c=new C({});this.tpl=document.getElementById('dc-tpl').content;this.root=document.getElementById('dc-root');this.render();if(this.c.componentDidMount)this.c.componentDidMount();},
          schedule(){if(this.q)return;this.q=true;requestAnimationFrame(()=>{this.q=false;this.render();});},
          render(){const box=document.createElement('div');this.build(this.tpl,box,[this.c.renderVals()]);this.morph(this.root,box);},
          get(path,sc){path=path.trim();if(path==='true')return true;if(path==='false')return false;const ps=path.split('.');let v;for(const s of sc){if(s&&Object.prototype.hasOwnProperty.call(s,ps[0])){v=s[ps[0]];break;}}for(let i=1;i<ps.length&&v!=null;i++)v=v[ps[i]];return v;},
          val(str,sc){const m=/^\s*\{\{([^}]+)\}\}\s*$/.exec(str);if(m)return this.get(m[1],sc);return str.replace(/\{\{([^}]+)\}\}/g,(_, p)=>{const v=this.get(p,sc);return v==null?'':String(v);});},
          bind(el,type){el.__l=el.__l||{};if(el.__l[type])return;el.__l[type]=true;el.addEventListener(type,(e)=>{const h=el.__h&&el.__h[type];if(h)h(e);});},
          build(src,out,sc){for(const n of src.childNodes){if(n.nodeType===3){out.appendChild(document.createTextNode(this.val(n.data,sc)));continue;}if(n.nodeType!==1)continue;const tag=n.localName;
                                                           if(tag==='sc-for'){const list=this.val(n.getAttribute('list'),sc)||[];const as=n.getAttribute('as');list.forEach((it,i)=>this.build(n,out,[{[as]:it,$index:i}].concat(sc)));continue;}
                                                           if(tag==='sc-if'){if(this.val(n.getAttribute('value'),sc))this.build(n,out,sc);continue;}
                                                           const el=document.createElementNS(n.namespaceURI,tag);
                                                           for(const a of n.attributes){if(a.name.indexOf('hint-')===0)continue;const v=this.val(a.value,sc);if(/^on[a-z]/i.test(a.name)&&typeof v==='function'){const t=a.name.slice(2).toLowerCase();el.__h=el.__h||{};el.__h[t]=v;this.bind(el,t);continue;}if(v==null||typeof v==='function')continue;el.setAttribute(a.name,String(v));}
                                                           this.build(n,el,sc);out.appendChild(el);}},
          morph(o,n){const oc=Array.from(o.childNodes),nc=Array.from(n.childNodes);const len=Math.max(oc.length,nc.length);for(let i=0;i<len;i++){const a=oc[i],b=nc[i];if(!a){o.appendChild(b);continue;}if(!b){o.removeChild(a);continue;}if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName){o.replaceChild(b,a);continue;}if(a.nodeType===3){if(a.data!==b.data)a.data=b.data;continue;}
                                                                                                                                                  for(const at of Array.from(a.attributes)){if(!b.hasAttribute(at.name))a.removeAttribute(at.name);}
                                                                                                                                                  for(const at of b.attributes){if(a.getAttribute(at.name)!==at.value)a.setAttribute(at.name,at.value);}
                                                                                                                                                  if(b.__h){a.__h=Object.assign(a.__h||{},b.__h);for(const t in b.__h)this.bind(a,t);}
                                                                                                                                                  this.morph(a,b);}}};
