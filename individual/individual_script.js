let overlap_sketch = function (p) {
    // Overlap between v and w

    p.setup = function () {
        p.canvas = p.createCanvas(100, 100);
        const w = p.canvas.elt.parentElement.clientWidth;
        const h = p.canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
        p.v = Complex['ZERO'];
        p.w = Complex['ZERO'];
        p.v_ghost = Complex['ZERO'];
        p.w_ghost = Complex['ZERO'];
        p.one = p.width / 2 - 20;
        p.noLoop();

    }
    p.draw = function () {
        p.background(250);
        complexUnitCircle(p);
        {// draw alpha and beta
            p.translate(p.width / 2, p.height / 2);
            p.strokeWeight(5);
            const offset = 5;
            {// angle for v
                const c = p.color(59, 155, 214, 220)
                p.stroke(c);
                const alpha = p.v.arg();
                if (alpha > 0) {
                    p.arc(0, 0, 2 * p.one + offset, 2 * p.one + offset, -alpha, 0);
                } else if (alpha < 0) {
                    p.arc(0, 0, 2 * p.one + offset, 2 * p.one + offset, 0, -alpha);
                }
                p.push();
                p.rotate(-alpha);
                p.translate(p.one + 3 * offset, 0);
                p.rotate(alpha);
                p.fill(c);
                p.textSize(20);
                p.strokeWeight(1);
                p.text("α", 0, 0);
                p.pop();
            }
            {// angle for w
                const c = p.color(251, 119, 16, 220);
                p.stroke(c);
                const beta = p.w.arg();
                if (beta > 0) {
                    p.arc(0, 0, 2 * p.one - offset, 2 * p.one - offset, -beta, 0);
                } else if (beta < 0) {
                    p.arc(0, 0, 2 * p.one - offset, 2 * p.one - offset, 0, -beta);
                }
                p.push();
                p.rotate(-beta);
                p.translate(p.one + 3 * offset, 0);
                p.rotate(beta);
                p.fill(c);
                p.textSize(20);
                p.strokeWeight(1);
                p.text("β", 0, 0);
                p.pop();
            }
            p.translate(-p.width / 2, -p.height / 2);
        }
        
        // arc/angle starting from w, ending at v
        // Çok zor oldu, ama sonunda oldu: olmamış
        // Şimdi oldu!
        if (p.w.abs() > 0 || p.v.abs() > 0) {
            show(p, p.v, false, p.color(79, 175, 214, 220));
            show(p, p.w, false, p.color(251, 139, 36, 220));
            p.stroke(148, 0, 211, 220);
            p.strokeWeight(2);
            const start = p.w.arg() < 0 ? p.w.arg() + 2 * Math.PI : p.w.arg();
            const end = p.v.arg() < 0 ? p.v.arg() + 2 * Math.PI : p.v.arg();
            const dia = 2 * p.one;
            const delta = end - start;
            let delta_normalized = delta;
            let delta_normalized_degree = delta_normalized * 180 / Math.PI;
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.colorMode(p.RGB, 180);
            if (end == start) {
                // Do not draw!
            } else if (delta > 0 && delta < Math.PI) {
                // starttan end'e yayı çiz
                delta_normalized = delta;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -end, -start/*p.PIE*/);
                //console.log("A")
            } else if (delta > Math.PI) {
                // endden starta çiz
                delta_normalized = delta - 2 * Math.PI;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -start, -end/*p.PIE*/);

                //console.log("B")

            } else if (delta < 0 && delta > -Math.PI) {
                // exp: endden starta
                delta_normalized = delta;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -start, -end/*p.PIE*/);
                //console.log("C")

            } else if (delta < -Math.PI) {
                // exp: starttan ende
                delta_normalized = delta + 2 * Math.PI;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 80);
                p.arc(0, 0, dia, dia, -end, -start/*p.PIE*/);
                //console.log("D")
            }
            p.rotate(-end);
            const h = p.constrain(delta_normalized * dia / 2 / 5, -p.width / 30, p.width / 30);
            //console.log(delta_normalized_degree);
            p.line(dia / 2, 0, dia / 2 - h / 1.73, 2 * h / 1.73);
            p.line(dia / 2, 0, dia / 2 + h / 1.73, 2 * h / 1.73);
            p.pop();
            p.colorMode(p.RGB, 255);
            p.textSize(20);
            //p.text(delta_normalized_degree, p.width / 2, p.height / 2);
        }

        // arc/angle starting from w_ghost, ending at v_ghost
        show(p, p.v_ghost, true, p.color(0), p.color(79, 175, 214, 80));
        show(p, p.w_ghost, true, p.color(0), p.color(251, 139, 36, 80));
    }
};
let static_sketch = function (p) {
    p.setup = function () {
        p.canvas = p.createCanvas(100, 100);
        const w = p.canvas.elt.parentElement.clientWidth;
        const h = p.canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
        p.one = p.width / 2 - 20;
        p.anchors = [];
        p.ghosts = [];
        p.showPie = false;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250);
        complexUnitCircle(p);
        p.anchors.forEach(anchor => {
            if (p.showPie) {
                const alpha = anchor.arg();
                p.push();
                p.colorMode(p.RGB, 180);
                p.translate(p.width / 2, p.height / 2);
                p.fill(Math.abs(alpha / Math.PI * 180), 180 - Math.abs(alpha / Math.PI * 180), 0, 80);
                if (alpha > 0) {
                    p.arc(0, 0, p.one, p.one, -alpha, 0);
                } else if (alpha < 0) {
                    p.arc(0, 0, p.one, p.one, 0, -alpha);
                }
                p.rotate(-alpha);
                const h = p.constrain(alpha * p.one / 2 / 5, -p.width / 20, p.width / 20);
                p.line(p.one / 2, 0, p.one / 2 - h / 1.73, 2 * h / 1.73);
                p.line(p.one / 2, 0, p.one / 2 + h / 1.73, 2 * h / 1.73);
                p.pop();
            }
            p.colorMode(p.RGB, 255);
            show(p, anchor, false, p.color(25, 220));
        });
        p.ghosts.forEach(ghost => {
            show(p, ghost, false, p.color(25, 80));
        });
    }
};
// MAIN MAGIC RUNS HERE:
window.onload = (function () {
    let v = new p5(editable_sketch, "v");
    v.solid_color = v.color(79, 175, 214, 220);
    v.ghost_color = v.color(79, 175, 214, 80);
    let w = new p5(editable_sketch, "w");
    w.solid_color = w.color(251, 139, 36, 220);
    w.ghost_color = w.color(251, 139, 36, 80);
    let overlap = new p5(overlap_sketch, "overlap");
    let score = new p5(static_sketch, "score");
    score.showPie = true;
    let updateHandler = (function (e) {
        /*
            Quick reminder here: 
            in "editable_sketch", complex numbers stored are called "W" and "W_ghost". 
            This has nothing to do with "w" defined in upper context. It is just a name similarity (from use of W in complex algebra)
        */
        overlap.v = v.W; // This means complex number associated with "v" inside "overlap" should be the complex number stored in "v"
        overlap.w = w.W;
        overlap.v_ghost = v.W_ghost;
        overlap.w_ghost = w.W_ghost;
        overlap.redraw();
        // score ....
        // Score, pasif bir görüntüleyici olacak.
        // Burada iki kompleks sayının çarpımını hesaplayalım.
        // Sonra score'a çizeceği sayı verilsin.
        const anchor = v.W.mul(w.W.conjugate());
        const ghost = v.W_ghost.mul(w.W_ghost.conjugate());
        score.anchors = [anchor];
        score.ghosts = [ghost];
        score.redraw();
    });
    document.body.addEventListener("componentUpdate", updateHandler);
    let leaveHandler = (function (e) {
        v.W_ghost = Complex['ZERO'];
        w.W_ghost = Complex['ZERO'];
        updateHandler();
    });
    document.body.addEventListener("mouseleave", leaveHandler);
    let resizeHandler = (function (e) {
        const p5s = [v, w, overlap, score];
        p5s.forEach(p => {
            const w = p.canvas.elt.parentElement.clientWidth;
            const h = p.canvas.elt.parentElement.clientHeight;
            p.resizeCanvas(w, h);
            p.one = p.width / 2 - 20;
        });
    });
    window.addEventListener("resize", resizeHandler);
});