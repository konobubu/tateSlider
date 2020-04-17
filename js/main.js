$(function(){
    $('#slideshow').each(function(){
        var $container = $(this);
        var $slideGroups = $container.find('#slideshow-slides');
        var $slideImgs = $slideGroups.find('.slide-item');
        var $indicator = $container.find('#indicator');
        var $indicatorHTML = '';
        var $start = '';
        var $direction = '';
        var $currentIndex = 0;
        var $duration = 100;
        var $interval = 10000;
        var $timer = '';
        var $slideCount = $slideImgs.length;
        $slideImgs.on('touchstart', TouchStart); //指が触れたら呼び出す
        $slideImgs.on('touchmove', TouchMove); //指が動いたら呼び出す
        $slideImgs.on('touchend', TouchEnd); //指が離れたら呼び出す
        
        $slideImgs.each(function(i){
            $(this).css({ top: 100 * i + 'px' }); //初期の位置を決めています
            $indicatorHTML += `<a href="#" class="indicator-icon"></a>`;
        });

        console.log($container);

        $indicator.html($indicatorHTML);

        function changeSlide(index){
        $slideGroups.animate({
            'top': -100 * index + '%' //cssで目的の位置に移動
        },$duration);
        $currentIndex = index;
        updateNav();
        startTimer()
        };

        function getPosition(event) {  //タッチした際の座標を取得しています
        return event.originalEvent.touches[0].pageX;
        }

        function updateNav(){
            $indicator.find('a').addClass('indicator-icon')
            .removeClass('active-indicator')
            .eq($currentIndex)
            .removeClass('indicator-icon')
            .addClass('active-indicator');
        };

        function TouchStart(event){ //指が触れたら動く関数
        console.log(event);
        $start = getPosition(event);
        $direction = ''; //一度リセットする
        }

        function TouchMove(event){ //指を動かしたら動く関数
        if($start - getPosition(event) > 70){
            $direction = "right";
        }else if ($start - getPosition(event) < -70){
            $direction = "left";
        }
        }

        function TouchEnd(event){
        // event.preventDefault(); //本来のaタグの挙動を削除
        if($direction === "right"){
            if($currentIndex === $slideCount-1){
            changeSlide(0);
            }else{
            changeSlide($currentIndex + 1);
            }
        }else if($direction === "left"){
            if($currentIndex === 0){
            changeSlide($slideCount-1);
            }else{
            changeSlide($currentIndex - 1);
            }
        }
        }

        // $nav.on('click', 'a', function(event){
        //   event.preventDefault(); //本来のaタグの挙動を消す
        //   if($(this).hasClass("slide-prev")){
        //     changeSlide($currentIndex - 1);
        //   }else{
        //     changeSlide($currentIndex + 1);
        //   }
        // });

        $indicator.on('click', 'a', function(event){
        event.preventDefault();
        if(!$(this).hasClass('active-indicator')){
            changeSlide($(this).index());
        }
        });

    
        function setTimer(){
        $timer = setTimeout(function(){
            var $nextIndex = ($currentIndex + 1) % $slideCount;
            changeSlide($nextIndex);
        }, $interval);
        } 

        function startTimer(){
        if($timer){
            this.stop();
            clearTimeout($timer);
        }
        setTimer();
        }

        changeSlide($currentIndex);


    })
});