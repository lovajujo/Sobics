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
let colors=['pink', 'green', 'dblue', 'lblue', 'purple'];
let brick_width;
let brick_height;
let id_helper=0;
let holding=false;
let interval;
const instructions="<p id='instructions'>Help Grogu collect bricks!<br> Choose a brick or a dynamite (which will blow the whole column) from the bottom row, " +
    "then click on the column, where you want to put it. Bricks will disappear, when there are at least 4 next to each other.</p>"
let ss=$('<div class="startscreen"></div>');
let start_button=$('<button id="start" onclick="game()">START</button>')
let lb_button=$('<button id="lb" onclick="game_over()">Leader Board</button>')
let go=$('<div class="startscreen"></div>')
let go_text=$('<p id="gameover">Game Over</p>');
let lb_add_button=$('<button id="lb_add" onclick="add_highscore()">Add to leader board</button>')



$(document).ready(function () {
    game_area=$("#game_area");
    container=$('#container');
    curr_bricks=$('#bricks');
    ga_width=parseInt(game_area.css('width'));
    ga_height=parseInt(game_area.css('height'));
    cont_height=parseInt(container.css('height'));
    brick_width=ga_width/column_number;
    brick_height=cont_height/13;
    start_screen();
})

function start_screen(){
    start_button.css({
        top: 350
    });
    lb_button.css({
        top: 425
    });
    game_area.append(ss);
    ss.append(start_button);
    ss.append(lb_button);
    ss.append(instructions);
}

function game(){
    ss.remove();
    go.remove();
    game_area.append(container);
    grogu=$('<img src="../res/groguu.png" id="grogu">');
    grogu.on('load', function(){
        init_grogu();
    });
    grid();
    $('#level').append(" "+level);
    $('#score').append(" "+score);
    container.on('mousemove', move_grogu);
    let moveables=$('.pink, .green, .lblue, .dblue, .purple,.dynamite')

    if(!holding){
        moveables.hover(function (){
            if(is_clickable($(this))){
                $(this).css({
                    opacity: 0.5
                });
            }
        },function () {
            $(this).css({
                opacity: 1
            })
        })
    }else{
        moveables.hover(function (){
            if(is_first_empty_tile($(this))){
                $(this).css({
                    border: "solid 3px red"
                })
            }
        }, function(){
            $(this).css({
                border: "solid white 1px"
            })
        })
    }
    moveables.on('click',function (){
        if(is_clickable($(this))){
            pick_brick($(this));
        }else{
            place_brick($(this));
        }
    });
    //interval=setInterval(new_line, 1000);

}

function leader_board(){
    //TODO
}

function add_highscore(score){
    //TODO
}

function game_over(){
    ss.remove()
    container.remove();
    grogu.remove();
    brick_array=[];
    clearInterval(interval);
    game_area.append(go);
    go.append(go_text);
    go.append(start_button);
    lb_add_button.css({
        top: 425
    })
    go.append(lb_add_button);
    $('#score').css({
        top: 425,
        left: 275
    });
    go.append($('#score'));
}

function place_brick(brick){
    let obj=brick_array.find(o=>o.id===brick.attr('id'));
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
    id_helper++;
    for(let i=0;i<cont_height/brick_height;i++){
        for(let j=0; j<ga_width/brick_width;j++){
            let uid=""+id_helper+""+i+""+j;
            brick_array.push({
                id:uid,
                y: i,
                x: j,
                cl: 'tile'
            })
        }
    }
    init_bricks();
    draw_grid();

}

function clear_bg(){
    let children=container.children()
    for(let i=0;i<children.length;i++){
        children[i].remove();
    }
}

function draw_grid(){
    clear_bg()
    brick_array.forEach(function (element){
        let tile=$('<div id="'+element.id+'"></div>');
        tile.addClass(element.cl);
        tile.css({
            height: brick_height,
            width: brick_width,
            top: element.y*brick_height,
            left:element.x*brick_width
        })
        container.append(tile);
    })
}

function init_bricks(){
    brick_array.forEach(function (b){
        if(b.y<row_number && b.x<column_number){
            b.cl=change_color();
        }
    })
}

function new_line(){
    brick_array.forEach(function (b){
        b.y+=1;
        if(b.y===12 && b.cl!=='tile'){
            game_over();
        }
    })
    brick_array=brick_array.filter(o=>{
        return o.y<13;
    });
    id_helper++;
    for(let i=0; i<column_number;i++){
        let uid=""+id_helper+""+i+""+0;
        brick_array.push({
            id: uid,
            x:i,
            y:0,
            cl: change_color()
        })
    }
    draw_grid()
}

function change_color(){
    if(Math.random()<0.03){
        return "wall";
    }
    if(Math.random()>0.97){
        return "dynamite";
    }
    let color=Math.floor(Math.random()*5);
    return colors[color];
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
        return false
    }
    let obj=brick_array.find(o=>o.id===brick.attr('id'));
    let next=brick_array.find(o=>o.y===obj.y+1 && o.x===obj.x);
    if(next.cl==='tile'){
        return true;
    }
}

function is_first_empty_tile(brick){
    let obj=brick_array.find(o=>o.id===brick.attr('id'));
    let prev=brick_array.find(o=>o.y===obj.y-1 && o.x===obj.x);
    if(obj.cl==='tile' && prev.cl!=='tile'){
        return true;
    }
}

