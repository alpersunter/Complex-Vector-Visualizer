let overlap_sketch = function (p) {
    // Overlap between v and w
    let one;
    let canvas;
    p.setup = function () {
        canvas = p.createCanvas(100, 100);
        const w = canvas.elt.parentElement.clientWidth;
        const h = canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
        p.v = Complex['ZERO'];
        p.w = Complex['ZERO'];
        p.v_ghost = Complex['ZERO'];
        p.w_ghost = Complex['ZERO'];
        one = p.width / 2 - 20;
        p.noLoop();
        p.colorMode(p.RGB, 180);
    }
    p.draw = function () {
        p.background(176);
        complexUnitCircle(p, one);
        // arc/angle starting from w, ending at v
        // Çok zor oldu, ama sonunda oldu: olmamış
        // Şimdi oldu!
        if (p.w.abs() > 0 || p.v.abs() > 0) {
            show(p, p.v, one, false, p.color(217, 3, 104, 220));
            show(p, p.w, one, false, p.color(251, 139, 36, 220));
            p.stroke(41, 23, 32);
            const start = p.w.arg() < 0 ? p.w.arg() + 2 * Math.PI : p.w.arg();
            const end = p.v.arg() < 0 ? p.v.arg() + 2 * Math.PI : p.v.arg();
            const dia = one;
            const delta = end - start;
            let delta_normalized = delta;
            let delta_normalized_degree = delta_normalized * 180 / Math.PI;
            p.push();
            p.translate(p.width / 2, p.height / 2);

            if (end == start) {
                // Do not draw!
            } else if (delta > 0 && delta < Math.PI) {
                // starttan end'e yayı çiz
                delta_normalized = delta;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -end, -start, p.PIE);
                //console.log("A")
            } else if (delta > Math.PI) {
                // endden starta çiz
                delta_normalized = delta - 2 * Math.PI;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -start, -end, p.PIE);

                //console.log("B")

            } else if (delta < 0 && delta > -Math.PI) {
                // exp: endden starta
                delta_normalized = delta;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 56);
                p.arc(0, 0, dia, dia, -start, -end, p.PIE);
                //console.log("C")

            } else if (delta < -Math.PI) {
                // exp: starttan ende
                delta_normalized = delta + 2 * Math.PI;
                delta_normalized_degree = delta_normalized * 180 / Math.PI;
                p.fill(Math.abs(delta_normalized_degree), 180 - Math.abs(delta_normalized_degree), 0, 80);
                p.arc(0, 0, dia, dia, -end, -start, p.PIE);
                //console.log("D")
            }
            p.rotate(-end);
            const h = p.constrain(delta_normalized * dia / 2 / 5, -p.width / 20, p.width / 20);
            //console.log(delta_normalized_degree);
            p.line(dia / 2, 0, dia / 2 - h / 1.73, 2 * h / 1.73);
            p.line(dia / 2, 0, dia / 2 + h / 1.73, 2 * h / 1.73);
            p.pop();
            p.textSize(20);
            p.text(delta_normalized_degree, p.width / 2, p.height / 2);
        }

        // arc/angle starting from w_ghost, ending at v_ghost
        show(p, p.v_ghost, one, true, p.color(0), p.color(217, 3, 104, 80));
        show(p, p.w_ghost, one, true, p.color(0), p.color(251, 139, 36, 80));
    }
};
let static_sketch = function (p) {
    let one;
    let canvas;
    p.setup = function () {
        canvas = p.createCanvas(100, 100);
        const w = canvas.elt.parentElement.clientWidth;
        const h = canvas.elt.parentElement.clientHeight;
        p.resizeCanvas(w, h);
        one = p.width / 2 - 20;
        p.anchors = [];
        p.ghosts = [];
        p.showPie = false;
        p.noLoop();
    }
    p.draw = function () {
        p.background(250);
        complexUnitCircle(p, one);
        p.anchors.forEach(anchor => {
            if (p.showPie) {
                const alpha = anchor.arg();
                p.push();
                p.colorMode(p.RGB, 180);
                p.translate(p.width / 2, p.height / 2);
                p.fill(Math.abs(alpha / Math.PI * 180), 180 - Math.abs(alpha / Math.PI * 180), 0, 80);
                if (alpha > 0) {
                    p.arc(0, 0, one, one, -alpha, 0);
                } else if (alpha < 0) {
                    p.arc(0, 0, one, one, 0, -alpha);
                }
                p.rotate(-alpha);
                const h = p.constrain(alpha * one / 2 / 5, -p.width / 20, p.width / 20);
                p.line(one / 2, 0, one / 2 - h / 1.73, 2 * h / 1.73);
                p.line(one / 2, 0, one / 2 + h / 1.73, 2 * h / 1.73);
                p.pop();
            }
            p.colorMode(p.RGB, 255);
            show(p, anchor, one, false, p.color(25, 220));
        });
        p.ghosts.forEach(ghost => {
            show(p, ghost, one, false, p.color(25, 80));
        });
    }
};
// MAIN MAGIC RUNS HERE:
window.onload = (function () {
    let v = new p5(editable_sketch, "v");
    v.solid_color = v.color(217, 3, 104, 220);
    v.ghost_color = v.color(217, 3, 104, 80);
    let w = new p5(editable_sketch, "w");
    w.solid_color = w.color(251, 139, 36, 220);
    w.ghost_color = w.color(251, 139, 36, 80);
    let overlap = new p5(overlap_sketch, "overlap");
    let score = new p5(static_sketch, "score");
    score.showPie = true;
    let updateHandler = function (e) {
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
    }
    let leaveHandler = function (e) {
        v.W_ghost = Complex['ZERO'];
        w.W_ghost = Complex['ZERO'];
        updateHandler();
    }
    document.body.addEventListener("componentUpdate", updateHandler);
    document.body.addEventListener("mouseleave", leaveHandler);
});