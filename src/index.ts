import { timeStamp } from "console";
import * as CryptoJS from "crypto-js";
import { abort } from "process";


class Block {
    public index         :number;
    public hash          :string;
    public prevHash      :string;
    public data          :string;
    public timeStamp     :number;

    static calculateBlockHash= (index:number, prevHash:string, timeStamp:number, data:string ):string => CryptoJS.SHA256( index + prevHash+timeStamp+data).toString();

    static validateStructure = (aBlock : Block ) : boolean => 
        typeof aBlock.index === "number" && 
        typeof aBlock.hash === "string" && 
        typeof aBlock.prevHash === "string" &&
        typeof aBlock.timeStamp === "number" &&
        typeof aBlock.data === "string";

    constructor(
        index           :number,
        hash            :string,
        prevHash        :string,
        data            :string,
        timeStamp       :number
    ){
        this.index  = index;
        this.hash   = hash;     
        this.prevHash = prevHash;
        this.data   = data;
        this.timeStamp = timeStamp;
    }
}


const genesisBlock:Block = new Block( 0, "202020202020020202020","","hello",123456);

let blockChain:[Block] = [genesisBlock];

const getBlockChain = () : [Block] =>blockChain;

const getLastblock =() : Block => blockChain[blockChain.length -1];
const getnewTimeStamp =() : number => Math.round(new Date().getTime() / 1000);

const createNewBlock =( data:string ) : Block => {

    const prevBlock : Block = getLastblock();
    const newIndex : number = prevBlock.index +1;
    const nextTimeStamp : number = getnewTimeStamp();
    const nextHash : string = Block.calculateBlockHash(newIndex, prevBlock.hash, nextTimeStamp, data);

    const newBlock : Block = new Block( newIndex, nextHash, prevBlock.hash , data, nextTimeStamp );
    
    addBock(newBlock);

    return newBlock;
}

const getHashforBlock = ( aBlock:Block ):string => Block.calculateBlockHash( aBlock.index, aBlock.prevHash, aBlock.timeStamp, aBlock.data ); 

const isBlockValid = (candidateBlock :Block , prevBlock : Block  ) : boolean =>{
    if( ! Block.validateStructure) {
        return false;
    }else if ( prevBlock.index + 1 !== candidateBlock.index){
        return false;
    }else if ( prevBlock.hash !== candidateBlock.prevHash ) {
        return false;
    }else if(  getHashforBlock( candidateBlock) !== candidateBlock.hash ){
        return false;
    }else{
        return true;
    } 
};

const addBock = ( candidateBlock : Block ) : void =>{
    
    if (isBlockValid( candidateBlock, getLastblock() ) ){
        blockChain.push(candidateBlock);
    }
}

createNewBlock("hello");
createNewBlock("hello 1");
createNewBlock("hello 2");

console.log(blockChain);
export {};

