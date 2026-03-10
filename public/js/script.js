window.onload = function() {
    const stage = new Konva.Stage({
        container: 'container',
        width: document.getElementById('container').offsetWidth,
        height: document.getElementById('container').offsetHeight
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // 1️⃣ Background image
    const imageObj = new Image();
    imageObj.src = 'images/background.jpg'; // must exist
    imageObj.onload = function() {
        const bg = new Konva.Image({
            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            image: imageObj
        });
        layer.add(bg);
        layer.draw();
        drawAllZones();
    };

    // 2️⃣ Shapes data
    const zones = [
        { "ZoneName": "Dining Zone", "ShapeData": "[{\"Type\":\"circle\",\"Points\":[{\"x\":230,\"y\":288}],\"Radius\":92,\"StrokeColor\":\"#808080\",\"FillColor\":\"rgba(128,128,128,0.5)\",\"Opacity\":0.5,\"StrokeWeight\":0.8}]" },
        { "ZoneName": "Zone 3", "ShapeData": "[{\"Type\":\"rectangle\",\"Points\":[{\"x\":342,\"y\":263}],\"Width\":215,\"Height\":239,\"StrokeColor\":\"#808080\",\"FillColor\":\"#c2185b\",\"Opacity\":0.5,\"StrokeWeight\":0.8}]" },
        { "ZoneName": "Zone 4", "ShapeData": "[{\"Type\":\"rectangle\",\"Points\":[{\"x\":510,\"y\":127}],\"Width\":451,\"Height\":97,\"StrokeColor\":\"#808080\",\"FillColor\":\"#c2185b\",\"Opacity\":0.5,\"StrokeWeight\":0.8}]" },
        { "ZoneName": "Zone 5", "ShapeData": "[{\"Type\":\"circle\",\"Points\":[{\"x\":271,\"y\":112}],\"Radius\":66,\"StrokeColor\":\"#808080\",\"FillColor\":\"#ffeb3b\",\"Opacity\":0.5,\"StrokeWeight\":0.8}]" }
    ];

    function drawAllZones() {
        zones.forEach(zone => {
            const shapes = JSON.parse(zone.ShapeData);
            shapes.forEach(s => {
                let shape;
                if (s.Type.toLowerCase() === 'rectangle') {
                    shape = new Konva.Rect({
                        x: s.Points[0].x,
                        y: s.Points[0].y,
                        width: s.Width,
                        height: s.Height,
                        stroke: s.StrokeColor,
                        fill: s.FillColor,
                        opacity: s.Opacity,
                        strokeWidth: s.StrokeWeight,
                        draggable: true
                    });
                } else if (s.Type.toLowerCase() === 'circle') {
                    shape = new Konva.Circle({
                        x: s.Points[0].x,
                        y: s.Points[0].y,
                        radius: s.Radius,
                        stroke: s.StrokeColor,
                        fill: s.FillColor,
                        opacity: s.Opacity,
                        strokeWidth: s.StrokeWeight,
                        draggable: true
                    });
                }
                if (shape) layer.add(shape);
            });
        });
        layer.draw();
    }

    // 3️⃣ Responsive
    window.addEventListener('resize', () => {
        stage.width(document.getElementById('container').offsetWidth);
        stage.height(document.getElementById('container').offsetHeight);
        layer.draw();
    });

    // 4️⃣ Snapshot download
    document.getElementById('saveSnapshotBtn').addEventListener('click', async () =>{
        try {
            const dataURL = stage.toDataURL({ pixelRatio: 2 });

            const response = await fetch('/save-snapshot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: dataURL })
            });

            const result = await response.json();
            console.log(result);
            if (result.success) {
                alert(`Snapshot saved as ${result.filename}`);
            } else {
                alert('Failed to save snapshot');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving snapshot');
        }
    });
};