import { regexMatches } from "./lab-core.mjs";
self.onmessage=event=>{try{const {pattern,flags,input}=event.data;self.postMessage({matches:regexMatches(pattern,flags,input)});}catch(e){self.postMessage({error:e.message});}};
