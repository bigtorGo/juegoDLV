//var canvas;

var fps=30;
let canvas=null;
let tablero=null;
//






function Celula(x,y,estado){//una forma de crear objetos sin describir su clase
    //el agente tiene los datos de su estado y posición actual. Además para saber cual será su próximo estado tendrá los valores de la posición de sus vecinos en una matriz de 3x3
        this.x=x;
        this.y=y;
        this.estado= estado// es el estado en que se encuentra el agente, 1 para vivo y 2 para muerto
        this.siguienteEstado= estado// es el príxomo estado en que se encontrara el agente, 1 para vivo y 2 para muerto
        
       
        //xVecino= (this.x+x+tablero.filas)% tablero.filas;//asignarle al vecino la posicion en x relativa al agente.
       // yVecino=this.y+y+tablero.columnas;//asignarle al vecino la posicion en y relativa al agente.
       this.actualizarEstado=function(){
            
            this.estado=this.siguienteEstado;
       }
       this.agregarVecinos=function(vecinos){
        this.vecinos=vecinos;
       }
       this.calcularSiguienteEstado=function(){//esta funcion contiene las reglas que permiten a un agente o celula, cambiar de estado
           // var arrayVecinos= Array.from(this.vecinos);
            let totalVivos=0;
            //let siguienteEstado=0;
            //var totalMuertos=0;
            for(var i=0;i<this.vecinos.length;i++){

              //  if(arrayVecinos[i].estado===0)totalMuertos++;
                if(this.vecinos[i].estado===1)totalVivos++;

            }
            //console.log( `hay ${totalVivos} vecinos vivos` );
            if(this.estado===1){//una celula permanece viva si tiene exactamente 2 o 3 vecinas vivas, en cualquier otro caso muere
                if(totalVivos===2  || totalVivos===3)  this.siguienteEstado= 1;
                else this.siguienteEstado= 0;
            }
            if(this.estado===0)//unca celula muerta vuelve a la vida si tiene 3 vecinos vivos.
            {
                if(totalVivos===3) this.siguienteEstado= 1;
            }
            

       }
    
}
    class Canvas{
        tileX;
        tileY;// tamaño del pixel que representará a la celula
        canvasHtml=null;//objeto canvas del html
        canvasX=0; //ancho del canvas
        canvasY=0;//alto del canvaz
        contextoGrafico=null;
        colorVivas= '#1EF11E';//codigo hexadecimal para el color blanco.
        colorMuertas= '#000000';//codigo hexadecimal para el color negro.
        constructor(canvasX,canvasY,filas,columnas){
            
            this.canvasX=canvasX;
            this.canvasY=canvasY;
            this.tileX= this.canvasX/columnas;
            this.tileY= this.canvasY/filas;
            
            this.canvasHtml= document.getElementById('canvas');
            this.contextoGrafico=this.canvasHtml.getContext('2d');
            this.canvasHtml.width=canvasX;
            this.canvasHtml.height= canvasY;
            //console.log(this.canvasHtml.width);
        }
    
        dibujarCelula(agente){
    
           
            if(agente.estado==0)
            this.contextoGrafico.fillStyle = this.colorMuertas; 
            if(agente.estado==1)
            this.contextoGrafico.fillStyle = this.colorVivas; 
            let posX=agente.x*this.tileX;
            let posY=agente.y*this.tileY;
            this.contextoGrafico.fillRect(posX, posY, this.tileX, this.tileY); 
    
        }
        dibujarTablero(tablero)
        {
           let matrizTablero=tablero.obtenerMatrizTablero();
           for(var x=0;x<tablero.filas;x++){
            for(var y=0;y<tablero.columnas;y++){
                    let celula= matrizTablero[x][y];
                    this.dibujarCelula(celula);

            }
           }
    
        }
        limpiarCanvas()
        {
            this.contextoGrafico.clearRect(0, 0, this.canvasX, this.canvasY);
        }
    
    }

class Tablero{
    filas=0;
    columnas=0;
   
    matrizTablero=null;
    constructor(filas, columnas)
    {
        this.filas= filas;
        this.columnas=columnas;
        this.matrizTablero= this.obtenerMatriz2D(filas,columnas);
    }
    obtenerMatriz2D(filas,columnas)
    {
        
        return this.matrizTablero = Array.from(Array(filas), () => new Array(columnas));
    }
    obtenerMatrizTablero()
    {
        return this.matrizTablero
    }
    agreagarAgente(posX,posY, agente)
    {
        if(this.matrizTablero!=null){

        this.matrizTablero[posX][posY]= agente;
       // console.log('se ha agregado un agente');
        //console.log(agente);
        }else{
            return 'Error, no exístte la matrz';
        }

    }
    llenarTablero()//llena el tablero con celulas con estados aleatorios. Se debe utilizar solo para generar las celulas en su estado inicial.
    {
        for(var x=0;x<this.filas;x++){
            for(var y=0; y<this.columnas;y++){
               
                
                let estado=Math.floor(Math.random() * 2);
                
                this.agreagarAgente(x,y,new Celula(x,y,estado));
                
                
            }
        }
        for(var x=0;x<this.filas;x++){
            for(var y=0; y<this.columnas;y++){
               
               
                let vecinos=this.obtenerVecinos(x,y);
                this.obtenerAgente(x,y).agregarVecinos(vecinos);//vecinos debe tener la referencia y no ser una copia
               
                
                
            }
        }
        
    }
    cambiarTablero(canvas){//este metodo tiene demasiados ciclos y hace lento el proceso, debería poder optimizarse
        
        
        for(var x=0;x<this.filas;x++){
            for(var y=0; y<this.columnas;y++){
               
                let celula=this.obtenerAgente(x,y);
                celula.calcularSiguienteEstado();
                
                //console.log(`Estado celula (${celula.x}, ${celula.y})actual ${celula.siguienteEstado}`);
                //this.obtenerAgente(x,y).actualizarEstado();
                
           
                
            }
        }
        for(var x=0;x<this.filas;x++){
            for(var y=0; y<this.columnas;y++){
               
                let celula=this.obtenerAgente(x,y);
                celula.actualizarEstado();
                canvas.dibujarCelula(celula);
                //console.log(`Estado celula (${celula.x}, ${celula.y})actual ${celula.siguienteEstado}`);
                //this.obtenerAgente(x,y).actualizarEstado();
                
           
                
            }
        }
        
      

    }
    obtenerAgente(posX,posY){
        if(this.matrizTablero!=null){
                let celula=this.matrizTablero[posX][posY];
                
               return celula;

            }else
            {
                return 'Error, no exístte la matrz';
            }

    }
    obtenerVecinos(posX,posY){//debe generar una referenciua de vecinos y no un arreglo de valores de este
        var vecinos=[8];
        if(this.matrizTablero!=null){
                
               
                 //xVecino= (this.x+x+tablero.filas)% tablero.filas;//asignarle al vecino la posicion en x relativa al agente.
       // yVecino=this.y+y+tablero.columnas;//asignarle al vecino la posicion en y relativa al agente.1

                for(var x=-1; x<2;x++ ){
                    for(var y=-1; y<2;y++ ){
                        var xVecino= (posX+x+this.columnas)%this.columnas;
                        var yVecino=(posY+y+this.filas)%this.filas;
                        if(x!=0 || y!=0){

                            vecinos.push(this.matrizTablero[xVecino][yVecino]);

                        }
                        
                    }
                }
                return vecinos;

            }else
            {
                return 'Error, no exístte la matrz';
            }

    }

}


function inicializa(){

   
  //calcular el tamaño de los tyles o cuadriculas del tableroo
    const filas=120,columnas=120;
    tablero= new Tablero(filas,columnas);
    canvas= new Canvas(500,500,filas,columnas);//mandar las filas y columnas del tablero para que el canvas pueda crear sus tiles en el tamaño del tablero correspondiente
    tablero.llenarTablero();
    canvas.dibujarTablero(tablero);
    
      
    

setInterval(function(){principal();},1000/fps);//se crea un bucle con set interval y se le pasa la función que se ejecutara en  una cantidad de tiempo en milisegundos.

}

function principal(){
    
   
    canvas.limpiarCanvas();
    tablero.cambiarTablero(canvas);
    //canvas.dibujarTablero(tablero);  
   
    
   
    
}