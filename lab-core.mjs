// Bounded, local developer utilities.
export function colorFormats(input) {
  let hex=input.trim().replace(/^#/,"");
  if (/^[0-9a-f]{3}$/i.test(hex)) hex=[...hex].map(x=>x+x).join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) throw new Error("请输入 3 位或 6 位 HEX 颜色");
  const [r,g,b]=hex.match(/../g).map(x=>parseInt(x,16));
  const [x,y,z]=[r,g,b].map(n=>n/255), max=Math.max(x,y,z),min=Math.min(x,y,z),d=max-min,l=(max+min)/2;
  let h=0,s=0;
  if(d){s=d/(1-Math.abs(2*l-1));h=(max===x?(y-z)/d:max===y?(z-x)/d+2:(x-y)/d+4)*60;if(h<0)h+=360;}
  return {hex:"#"+hex.toLowerCase(),rgb:"rgb("+[r,g,b].join(", ")+")",hsl:"hsl("+Math.round(h)+", "+Math.round(s*100)+"%, "+Math.round(l*100)+"%)"};
}
export function diffLines(before,after) {
  if(before.length>100000||after.length>100000) throw new Error("每侧最多 100,000 个字符");
  const lines=s=>s===""?[]:s.replace(/\r\n/g,"\n").split("\n");
  const a=lines(before),b=lines(after);
  if(a.length>400||b.length>400) throw new Error("每侧最多 400 行");
  const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>new Uint16Array(n+1));
  for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)dp[i][j]=a[i]===b[j]?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  const out=[];let i=0,j=0;
  while(i<m||j<n){if(i<m&&j<n&&a[i]===b[j]){out.push({type:"same",text:a[i++]});j++;}else if(i<m&&(j===n||dp[i+1][j]>=dp[i][j+1]))out.push({type:"remove",text:a[i++]});else out.push({type:"add",text:b[j++]});}
  return out;
}
export function regexMatches(pattern,flags,input) {
  if(pattern.length>500||input.length>20000)throw new Error("表达式最多 500 字符，文本最多 20,000 字符");
  if(!/^[gimsu]*$/.test(flags)||new Set(flags).size!==flags.length)throw new Error("支持不重复的 g、i、m、s、u 标志");
  const re=new RegExp(pattern,flags),out=[];
  let match;
  while((match=re.exec(input))!==null){
    out.push({index:match.index,text:match[0],groups:match.slice(1)});
    if(!re.global||out.length>=500)break;
    if(match[0]===""){const point=input.codePointAt(re.lastIndex);re.lastIndex+=re.unicode&&point>0xffff?2:1;}
  }
  return out;
}
