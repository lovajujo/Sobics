let level=1;
let score=0;
let timeout=10000;
let row_number=5;
let column_number=6;
let game_area;
let container;
let ga_width;
let ga_height;
let grogu;
let grogu_width=100;
let grogu_height;
let cont_height;
let brick_array=[];
let colors=['pink', 'green', 'dblue', 'lblue', 'purple'];
let brick_width;
let brick_height;
let id_helper=0;
let holding=false;
let interval;
let picked_brick_index;
let neighbours=[]
let ss=$('<div class="startscreen"></div>');
let instruction=$('<p id="instructions"><b>Help Grogu collect bricks!</b><br> Choose a brick or a dynamite (which will blow the whole column)\n' +
    '        from the bottom row, then click on the column,' +
    '        where you want to put it. Bricks will disappear, when there are at least 4 next to\n' +
    '        each other.</p>')
let start_button= $('<button id="start" style="top: 425px" onclick=play()>START</button>');
let lb_button=$('<button id="lb" style="top: 350px" onclick=show_leaderboard()>Leader Board</button>')
let head=$('<div id="head"><h2 id="sobics"><b>Sobics</b></h2><h2 id="score">Score: </h2></div>')
let leaderboard=$('<table id="leaderboard">\n' +
    '    <tr>\n' +
    '      <th>Player</th>\n' +
    '      <th>Score</th>\n' +
    '    </tr>\n' +
    '  </table>')
let add_score_button=$('<button id="add_to_lb" style="top: 350px" onclick=add_to_leaderboard()>Add to leader board</button>')
let name_input=$('<input type="text" required maxlength="10" placeholder="type your name" id="name_in">')

$(document).ready(function () {
    game_area=$("#game_area");
    container=$('#container');
    startscreen()
})

function startscreen(){
    game_area.append(ss);
    ss.append(instruction);
    ss.append(start_button);
    ss.append(lb_button);
}

function show_leaderboard(){
    //TODO
    game_area.append(ss);
    ss.append(leaderboard);
}

function play(){
    instruction.remove();
    lb_button.remove();
    ss.remove();
    game_area.append(head);
    ga_width=parseInt(game_area.css('width'));
    ga_height=parseInt(game_area.css('height'));
    cont_height=parseInt(container.css('height'));
    brick_width=ga_width/column_number;
    brick_height=cont_height/13;
    grogu=$('<img src="/res/img/groguu.png" id="grogu">');
    grogu.on('load', function(){
        init_grogu();
    });
    grid();
    $('#level').append(" "+level);
    $('#score').append(score);
    container.on('mousemove', move_grogu);

    container.on({
        mouseenter: function () {
            if(is_bottom_brick($(this))){
                $(this).css({
                    opacity: 0.5
                });
            }
        },
        mouseleave: function () {
            $(this).css({
                opacity: 1
            })
        }
    }, '.pink, .green, .lblue, .dblue, .purple,.dynamite');

    container.on('click', '.pink, .green, .lblue, .dblue, .purple,.dynamite',function (){
        if(is_bottom_brick($(this))){
            pick_brick($(this));
        }

    });

    container.on({
        mouseenter: function () {
            console.log('tile search')
            if(is_top_tile($(this))){
                $(this).css({
                    border: "solid white 3px"
                });
            }
        },
        mouseleave: function () {
            $(this).css({
                border: "none"
            })
        }
    }, '.tile');

    container.on('click','.tile', function (){
        if (is_top_tile($(this))){
            place_brick($(this));
        }
    })

    interval=setInterval(new_line, 500);
}

function check_if_scored(brick){
    if(brick.cl==='dynamite'){
        console.log('dynamite')
        destroy_column(brick);
    }else{
        neighbours.push(brick);
        let curr_color_bricks=brick_array.filter(o=>{
            return o.cl===brick.cl;
        });
        check_neigbours(curr_color_bricks, brick);
        if(neighbours.length>=4){
            console.log(score)
            remove_bricks(neighbours);
        }
    }
    neighbours=[];
}

function destroy_column(dyn){
    let col=brick_array.filter(o=>{
        return o.x===dyn.x;
    })
    console.log(col)
    col.forEach(function (o){
        col.cl='tile';
    })
    remove_bricks(col)
}

function remove_bricks(array){
    brick_array.forEach(function (original_b){
        array.forEach(function (to_remove){
            if(original_b.x===to_remove.x && original_b.y===to_remove.y){
                original_b.cl='tile';
            }
        })
    })
    console.log(array)
    score+=neighbours.length*10;
    $('#score').text("Score: "+score);
    draw_grid();
    fill_empty_spaces()
}

function check_neigbours(array, current){
    array.forEach(function (e){
        if(e.x-current.x===1 && e.y===current.y && !neighbours.includes(e)){
            neighbours.push(e);
            check_neigbours(array, e);
        }else if(e.x-current.x===-1 && e.y===current.y && !neighbours.includes(e)){
            neighbours.push(e);
            check_neigbours(array, e);
        }else if(e.y-current.y===1 && e.y===current.x &&!neighbours.includes(e)){
            neighbours.push(e);
            check_neigbours(array, e);
        }else if(e.y-current.y===-1 && e.x===current.x && !neighbours.includes(e)){
            neighbours.push(e);
            check_neigbours(array, e);
        }
    })
}
function fill_empty_spaces(){
    //TODO
}

function game_over(){
    clearInterval(interval);
    brick_array=[];
    container.remove();
    grogu.remove();
    game_area.append(ss);
    ss.append(add_score_button);
    ss.append(name_input)

}

function add_to_leaderboard(){
    let name=$('#name_in').val();
    console.log(name);

}

function place_brick(brick){
    let to=brick_array.find(o=>o.id===brick.attr('id'));
    let from=brick_array.find(o=>o.id===brick_array[picked_brick_index].id);
    let to_index=brick_array.findIndex(o => {
        return o.id === to.id;
    });
    let from_index=brick_array.findIndex(o => {
        return o.id === from.id;
    });
    brick_array[to_index].cl=brick_array[from_index].cl;
    brick_array[from_index].cl='tile';
    draw_grid();
    holding=false;
    check_if_scored(to);
}

function pick_brick(brick){
    holding=true;
    brick.css({
        border: "solid white 5px",
        width: brick_width*0.92
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
    console.log(brick_array)
}

function init_bricks(){
    let prev;
    brick_array.forEach(function (b){
        if(b.y<row_number && b.x<column_number){
            b.cl=prev;
            while(b.cl===prev){
                b.cl=change_color();
            }
            prev=b.cl;
        }
    })
}

function new_line(){
    brick_array.forEach(function (b){
        b.y+=1;
        if(b.y===10 && b.cl!=='tile'){
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

function is_bottom_brick(brick){
    if(holding){
            return false;
    }
    let obj=brick_array.find(o=>o.id===brick.attr('id'));
    picked_brick_index=brick_array.findIndex(o => {
        return o.id === obj.id;
    });
    let next=brick_array.find(o=>o.y===obj.y+1 && o.x===obj.x);
    if(next.cl==='tile'){
        return true;
    }
}

function is_top_tile(tile){
    if(!holding){
        return false;
    }
    let obj=brick_array.find(o=>o.id===tile.attr('id'));
    if(obj.y>0){
        let prev=brick_array.find(o=>o.y===obj.y-1 && o.x===obj.x);
        if(prev.cl!=='tile' && prev!==brick_array[picked_brick_index]){
            return true;
        }
    }else if(obj.y===0){
        return true;
    }


}

