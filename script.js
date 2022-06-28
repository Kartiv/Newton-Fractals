class Polynomial{

    constructor(coeffs){
        this.coeffs = coeffs;
        this.deg = this.coeffs.length-1;
    }

    diff(){
        let der = [];
        for(let i=0; i<this.deg; i++){
            der[i] = this.coeffs[i+1].mult(new Complex(i+1));
        }
        return new Polynomial(der);
    }

    eval(x){
        let s = new Complex(0);
        for(let i=0; i<this.deg+1; i++){
            s=s.add(this.coeffs[i].mult(x.pow(i)));
        }
        return s;
    }

    add(q){
        let p1;
        let p2;
        if(this.deg>q.deg){
            p1 = q;
            p2 = this;
        }
        else{
            p1=this;
            p2=q;
        }

        let newPol = [];
        for(let i=0; i<p1.deg+1; i++){
            newPol[i] = p1.coeffs[i].add(p2.coeffs[i]);
        }
        for(let i=p1.deg+1; i<p2.deg+1; i++){
            newPol[i] = p2.coeffs[i];
        }
        return new Polynomial(newPol);
    }

    mult(q){
        let newArr = []
        for(let i=0; i<q.deg+this.deg+1; i++){
            newArr[i] = new Complex(0);
        }

        for(let i=0; i<q.deg+1; i++){
            for(let j=0; j<this.deg+1; j++){
                newArr[i+j] = newArr[i+j].add(q.coeffs[i].mult(this.coeffs[j]));
            }
        }

        return new Polynomial(newArr);
    }
}

class Complex{
    constructor(a,b){
        this.re = a;
        if(!b){
            this.im = 0;
        }
        else{
            this.im = b;
        }
    }

    add(z){
        return new Complex(this.re+z.re, this.im+z.im);
    }

    sub(z){
        return new Complex(this.re-z.re, this.im-z.im);
    }

    mult(z){
        return new Complex(this.re*z.re-this.im*z.im, this.re*z.im+this.im*z.re);
    }

    conj(){
        return new Complex(this.re, -this.im);
    }

    norm(){
        return new Complex(Math.sqrt(this.re**2+this.im**2));
    }

    div(z){
        if(z==0){
            alert("Division By 0");
        }
        return this.mult(z.conj()).mult(new Complex(1/(z.norm().re)**2));
    }

    pow(n){
        p = new Complex(1);
        for(let i=0; i<n; i++){
            p = p.mult(this);
        }
        return p;
    }
}

class Newton{
    constructor(p, steps){
        this.p = p;
        this.q = p.diff();
        this.steps = steps;
    }

    newton(x0){
        for(let i=0; i<this.steps; i++){
            x0 = x0.sub(this.p.eval(x0).div(this.q.eval(x0)));
        }
    
        return x0;
    }
}

function closePoint(x0, arr){
    let index = 0;
    let min = 1000;
    for(let i=0; i<arr.length; i++){
        let d = x0.sub(arr[i]).norm().re;
        if(d<min){
            index = i;
            min = d;
        }
    }
    return index;
}

function fillPix(x, y, c, colorList = ['darkblue', 'purple', 'aqua', 'crimson', 'olive']){
    ctx.fillStyle = colorList[c];
    ctx.fillRect(x, y, pix, pix)
    ctx.fill();
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

//ctx.translate(canvas.width/2, canvas.height/2);
//ctx.scale(1, -1);

let boxBound = 1;
let xmin = -boxBound;
let xmax = boxBound;
let ymin = -boxBound;
let ymax = boxBound;

let xscale = (xmax-xmin)/canvas.width;
let yscale = (ymax-ymin)/canvas.height;

var pix = 1;

var steps = 20;

var p = new Polynomial([new Complex(1),new Complex(0),new Complex(0), new Complex(1)]);
var roots = [new Complex(-1,0), new Complex(0,1), new Complex(0,-1)];

var main = new Newton(p, steps);

for(let i=0; i<canvas.width; i+=pix){
    for(let j=0; j<canvas.height; j+=pix){
        let c = closePoint(main.newton(new Complex(xmin+i*xscale, ymax-j*yscale)), roots);
        fillPix(i, j, c);
    }
}

//need to add:
//-polynomial division
//-root calculation (with polynomial division and one use of Newton Raphson)
//-optimization (?)
//-interactive (after making sure this runs in reasonable time under some conditions or optimization)