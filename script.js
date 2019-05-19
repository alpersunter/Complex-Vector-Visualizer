let sketch = function (p) {
    let one;
    p.setup = function () {
        p.createCanvas(300, 300);
        p.W = Complex['ZERO'];
        one = p.width / 2 - 20;
        p.noLoop();
    };
    p.draw = function () {
        p.background(255);
        complexUnitCircle();
        show(p.W);
    };
    function complexUnitCircle() {
        // // Write labels "i" and "1" indicating imaginary and real units
        // p.textSize(20);
        // p.noStroke();
        // // Red for i
        // p.fill(230, 0, 0);
        // p.text("i", p.width / 2 + 10, 18);
        // // Green for 1
        // p.fill(0, 180, 0);
        // p.text("1", p.width - 20, p.height / 2 - 10);

        // Draw axes
        p.strokeWeight(2);
        // Red for imaginary
        p.stroke(230, 0, 0);
        p.line(p.width / 2, 0, p.width / 2, p.height);
        // Green for real
        p.stroke(0, 180, 0);
        p.line(0, p.height / 2, p.width, p.height / 2);

        // Draw the unit circle
        p.noFill();
        p.stroke(50);
        p.strokeWeight(1);
        p.circle(p.width / 2, p.height / 2, 2 * one);
    }
    function show(w) {
        p.push();
        p.strokeWeight(3);
        p.stroke(87, 144, 193, 200);
        p.translate(p.width / 2, p.height / 2);
        w = w.mul(new Complex(one, 0));
        p.line(0, 0, w.re, -w.im);
        p.noStroke();
        p.fill(87, 144, 193, 200);
        p.circle(w.re, -w.im, w.abs() / 8);
        p.pop();
    }
}

let Zs = [];

const welcome = "Hey, curious!\nFeel free to play with my code.\nIf you need any help, reach me at alpersunter@mail.ru or at https://github.com/alpersunter\nHappy inspecting :)";
window.onload = function () {
    console.log(welcome);
    for(let i = 0; i < 50; i++){
        // Create "box"
        let box = document.createElement("div");
        // Set its class
        box.className = "box";
        // Add box as a child to body
        document.body.appendChild(box);
        box.id = "Z" + i.toString();
        // Create "input"
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "a + bi";
        // Add input as a child to box
        box.appendChild(input);
        let z = new p5(sketch, box.id);
        Zs.push(z);
    }
    Zs.forEach(element => {
        const Z_box = element.canvas.parentElement; // Bu çok iyi oldu! 
        // İleride yeni örnekler eklemek çok kolay olacak.
        const Z_input = Z_box.querySelector("input");
        const changeHandler = function (e) {
            let userInput = e.srcElement.value;
            let c;
            try {                           // Try parsing user input.
                c = new Complex(userInput);
            } catch (error) {               // If user input was bad:
                console.log(error.message + ": Enter a complex number like '3' or '5i' or '3 - 5i'");
                c = Complex['ZERO'];
            }
            // Update Z.W
            element.W = c;
            e.srcElement.value = c.toString();
            element.redraw();
        };
        Z_input.addEventListener("change", changeHandler)
    });
}
