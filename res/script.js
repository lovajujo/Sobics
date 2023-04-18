let level=1;
let score=0;
let timeout=8000;
let row_number=5;
let column_number=6;
let game_area;
let ga_width;
let ga_height;
let grogu;
let grogu_width=100;
let grogu_height;
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
let id_helper=0;
let holding=false;



$(document).ready(function () {
    game_area=$("#game_area");
    container=$('#container');
    curr_bricks=$('#bricks');
    ga_width=parseInt(game_area.css('width'));
    ga_height=parseInt(game_area.css('height'));
    cont_height=parseInt(container.css('height'));
    brick_width=ga_width/column_number;
    brick_height=cont_height/13;

    grogu=$('<img src="../res/groguu.png" id="grogu">');
    grogu.on('load', function(){
        init_grogu();
    });

    //add_bricks(row_number);
    grid();

    $('#level').append(" "+level);
    $('#score').append(" "+score);

    container.on('mousemove', move_grogu);

    $('.bricks:not(.wall)').hover(function (){
        if(is_clickable($(this))){
        $(this).css({
            opacity: 0.5,
            cursor: "grab"
        });
    }},function () {
        $(this).css({
            opacity: 1
        })
    })
    $('.bricks:not(.wall)').on('click',function (){
        if(is_clickable($(this))){
            pick_brick($(this));
        }else{
            place_brick($(this));
        }
    });
    //setInterval(append_bricks, 1000);

})

function place_brick(brick){
    let obj=brick_array.find(o=>o.id===brick.id);
    let y=obj.y;
    //TODO


}

function pick_brick(brick){
    holding=true;
    brick.css({
        width: brick_width/2,
        height: brick_height/2,
        left: brick_width/4+parseInt(brick.css('left')),
        top: parseInt(brick.css('top'))+brick_height/4,
    })
}

function init_grogu(){
    grogu.css({
        width: grogu_width,
        bottom: 10,
        left: ga_width/2-grogu_width
    });
    grogu_height=parseInt(grogu.css('height'));
    game_area.append(grogu);
}

function grid(){
    for(let i=0;i<ga_width/brick_width;i++){
        for(let j=0; j<cont_height/brick_height;j++){
            let tile=$('<div class="tile"></div>');
            tile.css({
                height: brick_height,
                width:brick_width,
                top: j*brick_height,
                left: i*brick_width
            })
            let t_class='tile';
            if(i<column_number && j<row_number){
                change_color(tile);
            }

            brick_array.push({
                y: j,
                x: i,
                c: t_class
            })
            container.prepend(tile);
        }

    }
    console.log(brick_array)
}

function append_bricks(){
    for(let i=brick_array.length;i>=1;i--){
        let tile=brick_array[i];
        console.log(tile)
        let prev=brick_array.find(o=>o.x===tile.x && o.y===tile.y-1);
        tile.color=prev.color;
        if(tile.y===0){
            change_color(tile);
        }
    }

}

function change_color(tile){
    if(Math.random()<0.03){
        tile.addClass('wall');
    }
    else if(Math.random()>0.97){
        tile.addClass('dynamite');
    }else{
        let color=Math.floor(Math.random()*5)
        tile.css({
            "background-color": colors[color]
        });
    }
}

function add_bricks(rows=1){
    id_helper++;
    for(let i=0;i<rows;i++){
        if(curr_bricks.css('height')>=cont_height){
            //game_over();
            return;
        }
        let row=$('<div></div>');
        row.css({
            height: brick_height,
            width: ga_width,
        })
        curr_bricks.css({
            height: $(this).height+brick_height
        })
        curr_bricks.prepend(row);
        for(let j=0;j<column_number;j++){
            let uid=""+id_helper+""+i+""+j;
            let brick=$('<div id="'+uid+'" class="bricks"></div>');
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
            brick_array.push({
                id: uid,
                y:i,
                x:j,
                color: brick.css("background-color")
            })
            row.append(brick);
        }
    }
}

function move_grogu(ev){
    let div_pos=game_area.offset();
    let mouse_pos_x=Math.ceil(ev.clientX-div_pos.left-grogu_width/2);
    if(mouse_pos_x>0 && mouse_pos_x<ga_width-grogu_width){
        grogu.css({
            left: mouse_pos_x
        })
    }
}

function is_clickable(brick){
    if(holding){
        return false;
    }
    let obj=brick_array.find(o=> o.id===brick.attr('id'));
    return !brick_array.find(o => (o.y === obj.y - 1 && o.x === obj.x));
}
