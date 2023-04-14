let level=1;
let timeout=8000;
let row_number=5;
let column_number=6;
let game_area;
let ga_width;
let ga_height;
let cat;
let cat_width=100;
let cat_height;
let container;
let curr_bricks;
let cont_height;
let brick_array=[];
let colors=[
    "#de0085",
    "#AAFF00",
    "#0021fa",
    "#00eaff",
    "#9900cc"
];
let brick_width;
let brick_height;



$(document).ready(function () {
    game_area=$("#game_area");
    container=$('#container');
    curr_bricks=$('#bricks');
    ga_width=parseInt(game_area.css('width'));
    ga_height=parseInt(game_area.css('height'));
    brick_width=ga_width/column_number;
    brick_height=ga_height/13;
    cont_height=parseInt(container.css('height'));
    cat=$('<img src="../res/cat.png" id="cat">');
    cat.on('load', function(){
        init_cat();
    });
    init_ga();

    container.on('mousemove', move_cat);
    //TODO
    //hover, onclick, down to cat or just move

    //setInterval(add_bricks, 1000);

})

function init_cat(){
    cat.css({
        width: cat_width,
        bottom: 0,
        left: ga_width/2-cat_width
    });
    cat_height=parseInt(cat.css('height'));
    game_area.append(cat);
}

function init_ga(){
    for(let i=0;i<cont_height/brick_height;i++){
        let row=$('<div></div>');
        row.css({
            height: brick_height,
            width: ga_width,
            top: i*brick_height
        })
        container.append(row);
        for(let j=0;j<column_number;j++){
            let tile=$('<div></div>');
            tile.addClass('tile');
            tile.css({
                width: brick_width,
                height: brick_height,
                top: i*brick_height,
                left: j*brick_width
            });
            container.append(tile);
        }
    }
    add_bricks(row_number);
}

function add_bricks(rows=1){
    for(let i=0;i<rows;i++){
        let row=$('<div></div>');
        row.css({
            height: brick_height,
            width: ga_width,
        })
        curr_bricks.css({
            height: this.height+brick_height
        })
        curr_bricks.prepend(row);
        for(let j=0;j<column_number;j++){
            let brick=$('<div></div>');
            brick.addClass('bricks');
            if(Math.random()<0.03){
                brick.addClass('wall');
            }
            else if(Math.random()>0.97){
                brick.addClass('dynamite');
            }else{
                let color=Math.floor(Math.random()*5)
                brick.addClass(color);
                brick.css({
                    "background-color": colors[color]
                });
            }
            brick.css({
                width: brick_width,
                height: brick_height,
                left: j*brick_width
            });
            row.append(brick);
        }
    }
}

function move_cat(ev){
    let div_pos=game_area.offset();
    let mouse_pos_x=Math.ceil(ev.clientX-div_pos.left-cat_width/2);
    if(mouse_pos_x>0 && mouse_pos_x<ga_width-cat_width){
        cat.css({
            left: mouse_pos_x
        })
    }
}


