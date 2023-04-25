let level=1;
let score=0;
let time_left=11-level;
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
let instruction=$('<p id="instructions"><b>Help Grogu collect bricks!</b><br> Choose a brick, a dynamite or a clock \n' +
    '        from the bottom row, then click on the column,' +
    '        where you want to put it. Bricks will disappear, when there are at least 4 next to\n' +
    '        each other.</p>')
let start_button= $('<button id="start" style="top: 425px" onclick=play()>START</button>');
let lb_button=$('<button id="lb" style="top: 350px" onclick=show_leaderboard()>Leader Board</button>')
let head=$('<div id="head"><h2 id="sobics"><b>Sobics</b></h2><h2 id="level">Level: </h2>' +
    '<h2 id="score">Score: </h2><h2 id="time">Time: </h2></div>')
let leaderboard=$('<table id="leaderboard">\n' +
    '    <tr>\n' +
    '      <th>Rank</th>\n' +
    '      <th>Name</th>\n' +
    '      <th>Score</th>\n' +
    '    </tr>\n' +
    '  </table>')
let add_score_button=$('<button id="add_to_lb" style="top: 350px" onclick=add_to_leaderboard()>Add to leader board</button>')
let name_input=$('<input type="text" required maxlength="10" placeholder="type your name" id="name_in">');


$(document).ready(function () {
    game_area=$("#game_area");
    container=$('#container');
    startscreen()
})

function startscreen(){
    game_area.append(ss);
    ss.empty();
    ss.append(instruction);
    ss.append(start_button);
    ss.append(lb_button);
}

function show_leaderboard(){
    ss.empty();
    ss.append(start_button)
    ss.append(leaderboard);
    let scores=get_scores();
    scores.sort((a, b) => {
        return b.score-a.score;
    });
    scores.slice(0,9);
    for(let i=0;i<scores.length;i++){
        let rank=i+1;
        leaderboard.append('<tr class="table_lines"><td>'+rank+'.</td><td>'+scores[i].name+'</td><td>'+scores[i].score+'</td></tr>');
    }
}

function get_scores(){
    let keys=Object.keys(localStorage);
    let scores=[];
    for(let i=0;i<keys.length;i++){
        let next=localStorage.getItem(keys[i]).split(";");
        scores.push({
            date: keys[i],
            name: next[0],
            score: next[1]
        });
    }
    return scores;
}

function play(){
    ss.empty();
    ss.remove();
    game_area.append(head);
    game_area.append(container)
    score=0;
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
    $('#score').text("Score: "+score);
    $('#level').text("Level: "+level);
    $('#time').text("Time: "+time_left);
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
    }, '.pink, .green, .lblue, .dblue, .purple,.dynamite, .clock');

    container.on('click', '.pink, .green, .lblue, .dblue, .purple,.dynamite, .clock',function (){
        if(is_bottom_brick($(this))){
            pick_brick($(this));
        }

    });

    container.on({
        mouseenter: function () {
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

    interval=setInterval(function (){
        time_left--;
        $('#time').text("Time: "+time_left);
        if(time_left<4){
            $('#time').css({
                color: 'red'
            })
        }else{
            $('#time').css({
                color: 'darkgrey'
            })
        }
        if(time_left===0){
            new_line();
            time_left=11-level;
        }
    }, 1000);

}

function check_if_scored(brick){
    if(brick.cl==='dynamite'){
        destroy_column(brick);
    }else{
        neighbours.push(brick);
        let curr_color_bricks=brick_array.filter(o=>{
            return o.cl===brick.cl;
        });
        check_neigbours(curr_color_bricks, brick);
        if(neighbours.length>=4){
            remove_bricks(neighbours);
        }
    }
    neighbours=[];
}

function destroy_column(dyn){
    let col=brick_array.filter(o=>{
        return (o.x===dyn.x && o.cl!=='tile');
    });
    score+=col.length*10;
    col.cl="tile";
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
    score+=neighbours.length*10;
    $('#score').text("Score: "+score);
    draw_grid();
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

function game_over(){
    clearInterval(interval);
    brick_array=[];
    game_area.empty();
    game_area.append(ss);
    ss.append(add_score_button);
    ss.append(name_input);
    ss.append(start_button);

}

function add_to_leaderboard(){
    let name=$('#name_in').val();
    let value=""+name+";"+score;
    let key=Date.now().toString();
    localStorage.setItem(key, value);
    location.reload()
    alert('Score added!')
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

function draw_grid(){
    container.empty();
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
    if(Math.random()>0.97){
        return "wall";
    }
    if(Math.random()>0.97){
        return "dynamite";
    }
    if(Math.random()>0.90){
        return "clock";
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

