$(function(){
    $('#slideshow').each(function(){
        var $container = $(this);
        var $slideGroups = $container.find('#slideshow-slides');
        var $slideImgs = $slideGroups.find('.slide-item');
        var $indicator = $container.find('#indicator');
        var $indicatorHTML = '';
        var $direction = '';
        var $pageY = '';
        var $top = '';
        var $pos = '';
        var $touched = false;
        var $currentIndex = 0;
        var $duration = 100;
        var $interval = 10000;
        var $timer = '';
        var $slideCount = $slideImgs.length;
        console.log($slideCount);
        var isTouch = ('ontouchstart' in window); //タッチできるときtrue
        $slideGroups.on('touchstart', TouchStart); //指が触れたら呼び出す
        $slideGroups.on('touchmove', TouchMove); //指が動いたら呼び出す
        $slideGroups.on('touchend', TouchEnd); //指が離れたら呼び出す
        
        
        $slideImgs.each(function(i){
            $(this).css({ top: 1500 * i + 'px' }); //初期の位置を決めています
            $indicatorHTML += `<a href="#" class="indicator-icon"></a>`;
        });

        console.log($container);

        $indicator.html($indicatorHTML);

        function changeSlide(index){
            $slideGroups.animate({
                'top': -1500 * index + 'px' //cssで目的の位置に移動
            },$duration);
            $currentIndex = index;
            console.log($currentIndex);
            updateNav();
            startTimer()
        };

        function getPosition(event) {  //タッチした際の座標を取得しています
            return event.originalEvent.touches[0].pageY;
        }

        function updateNav(){
            $indicator.find('a').addClass('indicator-icon')
            .removeClass('active-indicator')
            .eq($currentIndex)
            .removeClass('indicator-icon')
            .addClass('active-indicator');
        };

        function TouchStart(event){ //指が触れたら動く関数
            event.preventDefault(); //本来の挙動をカット
            $direction = ''; //一度リセットする
            $pageY = (isTouch ? getPosition(event) : event.pageY); //ここのthisは$slideGroups
            $top = parseInt($(this).position().top); //topのcssの値
            $touched = true;
        }

        function TouchMove(event){ //指を動かしたら動く関数
            if(!$touched){
                return;
            }
            event.preventDefault();
            $top = $top - ($pageY - (isTouch ? getPosition(event) : event.pageY));
            $pos = $pageY - (isTouch ? getPosition(event) : event.pageY);
            console.log($pos);
            if($pos < -10 ){
                $direction = "up"
            }else if ($pos > 10){
                $direction = "down"
            }
            console.log($direction);

            $(this).css({top: $top});
            console.log($top);
            $pageY = (isTouch ? getPosition(event) : event.pageY);
        }

        function TouchEnd(event){
            event.preventDefault(); //本来のaタグの挙動を削除

            if($direction === "down"){
                if($currentIndex === $slideCount-1){
                    changeSlide(0);
                    console.log($direction);
                }else{
                changeSlide($currentIndex + 1);
                }
            }else if($direction === "up"){
                if($currentIndex === 0){
                    changeSlide($slideCount-1);
                }else{
                    changeSlide($currentIndex - 1);
                }
            }

            $touched = false;
        }

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