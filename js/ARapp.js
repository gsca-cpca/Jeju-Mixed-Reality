AFRAME.registerComponent('manager', {
    init: function () {
        let self = this;

        this.scene = document.querySelector('a-scene');
        $("#fullScreen").click(function () {
            if (!document.fullscreenElement
                && !document.mozFullScreenElement
                && !document.webkitFullscreenElement && !document.msFullscreenElement
            ) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });

        this.stage1Handler = this.stage1Handler.bind(this);
        this.stage2Handler = this.stage2Handler.bind(this);
        this.stage3Handler = this.stage3Handler.bind(this);
        this.stage4Handler = this.stage4Handler.bind(this);
        //
        $("#stage1").click(self.stage1Handler);
         $("#stage2").click(self.stage2Handler);
        $("#stage3").click(self.stage3Handler);
        $("#stage4").click(self.stage4Handler);



    },


    removeMarkerModels: function () {
        let u = document.querySelector('#union')
        let c = document.querySelector('#conf');
        if (u) {
            u.parentNode.removeChild(u)
        }
        if (c) {
            c.parentNode.removeChild(c)
        }
    },
    create3Dmodel: function (id, type) {
        let el = document.createElement('a-entity');
        el.setAttribute('gltf-model', '#unionTroop');
        el.setAttribute('id', id);
        el.setAttribute('animation-mixer', "clip:Idle");
        if (type === 'union') {
            let unionFlag = document.createElement('a-plane');
            unionFlag.setAttribute('src', '#unionFlag');
            unionFlag.setAttribute('height', "0.8");
            unionFlag.setAttribute('width', "1.2");
            unionFlag.setAttribute('position', "0 2 0");
            unionFlag.setAttribute('look-at', "[camera]");
            el.appendChild(unionFlag)

        } else {
            let confederateFlag = document.createElement('a-plane');
            confederateFlag.setAttribute('src', '#confederate');
            confederateFlag.setAttribute('height', "0.8");
            confederateFlag.setAttribute('width', "1.2");
            confederateFlag.setAttribute('position', "0 2 0");
            confederateFlag.setAttribute('look-at', "[camera]");
            el.appendChild(confederateFlag)
        }
        return el;
    },
    stage1Handler: function () {
        let _this = this;
        let s1old = document.querySelector('#s1');
        s1old.setAttribute('visible','true')
        let s2 = document.querySelector('#s2')
        s2.setAttribute('visible','false')
        let s20 = document.querySelector('#s21')
        s20.setAttribute('visible','false')

        let s3 = document.querySelector('#s3')
        s3.setAttribute('visible','false')
        let s4 = document.querySelector('#s4')
        s4.setAttribute('visible','false')
        $(".stage").removeClass('btn-danger').addClass('btn-dark');
        $("#stage1").removeClass('btn-dark').addClass('btn-danger');

        // $("#message01").fadeIn(500);
        $('.audio-play').each(function(){
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
        $("#audio1").trigger("play");
        $("#audio1").on("timeupdate",function () {
            if(0<this.currentTime && this.currentTime <2){
                $("#message").text("Hello! My name is Dol hareubang")
            }
            else if (2<this.currentTime && this.currentTime <10){
                $("#harubangimg").show()
                $("#harubangimg1").hide();
                $("#harubangimg2").hide();
                $("#message").text("I am also called tol harubang, or harubang. I am a large rock statue found on Jeju Island off the southern tip of South Korea.")
            }
            else if(10<this.currentTime && this.currentTime <20){
                $("#harubangimg1").show()
                $("#harubangimg").hide();
                $("#harubangimg2").hide();
                $("#message").text("I am usually considered to be a god offering both protection and fertility, and placed outside of gates for protection against demons travelling between realities.")

            }
            else if(20<this.currentTime && this.currentTime <25){
                $("#harubangimg2").show()
                $("#harubangimg1").hide();
                $("#harubangimg").hide();
                $("#txt01").attr('value',"I have become the symbol of Jeju Island, and replicas of various sizes are sold as tourist souvenirs.")
                $("#message").text("I have become the symbol of Jeju Island, and replicas of various sizes are sold as tourist souvenirs.")
            }
                else{
                $("#harubangimg").hide();
                $("#harubangimg1").hide();
                $("#harubangimg2").hide();
                $("#message").text("Now, let me take you to a great tourist spots of Jeju Island.")
            }
        })
        $("#audio1").on("ended", function () {
            // $("#s2").setAttribute('visible','false')
            // $("#s21").setAttribute('visible','false')
            let marker1 = document.querySelector('#pos1').object3D.position;
            let marker2 = document.querySelector('#pos2').object3D.position;
            let scene = document.querySelector('a-scene');
            let s1old = document.querySelector('#s1');
            s1old.setAttribute('visible','false')
            let t1 = document.createElement('a-entity');
            t1.setAttribute('gltf-model','#harubang')
            t1.setAttribute('id','t1')
            t1.object3D.position.copy(marker1);
            scene.append(t1);
            let curve = document.createElement('a-curve');
            curve.setAttribute('id', 'track1');
            let curvePoint1 = document.createElement('a-curve-point');
            let curvePoint2 = document.createElement('a-curve-point');
            curvePoint1.setAttribute('position', t1.object3D.position);
            curvePoint2.setAttribute('position', marker2);
            curve.appendChild(curvePoint1);
            curve.appendChild(curvePoint2);
            scene.appendChild(curve);
            t1.setAttribute('alongpath', {curve: '#track1', dur: 3000, rotate: true, delay: 1000});
            t1.addEventListener('movingended', stage1Finish)
            function stage1Finish() {
                let t1 = document.querySelector('#t1');
                if(t1) t1.parentNode.removeChild(t1);
                _this.stage2Handler();
            }


        })
    },
    stage2Handler: function () {
        let _this = this;
        let s2 = document.querySelector('#s2')
        s2.setAttribute('visible','true')

        let s20 = document.querySelector('#s21')
        s20.setAttribute('visible','true');

        let s3 = document.querySelector('#s3')
        s3.setAttribute('visible','false')
        let s4 = document.querySelector('#s4')
        s4.setAttribute('visible','false')
        $(".stage").removeClass('btn-danger').addClass('btn-dark');
        $("#stage2").removeClass('btn-dark').addClass('btn-danger');
        $("#message").text("")
        $('.audio-play').each(function(){
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
        $("#audio2").trigger("play");
        $("#audio2").on("timeupdate",function () {
            let s20 = document.querySelector('#s21')
            s20.object3D.rotation.y += 0.05;
            $("#templeGIF").show()
            if(0<this.currentTime && this.currentTime <5){
                $("#message").text("Here is one of the oldest standing architectures on Jeju Island")
            }
            else if (5<this.currentTime && this.currentTime <11){
                $("#message").text("Gwandeokjeong Pavilion was built by Pastor Sin Suk-Cheong in the thirtieth year of King Sejong's reign (1448) as a training ground")
            }
            else if(11<this.currentTime && this.currentTime <16){
                $("#message").text("For its historic contribution to strengthening the mind and soul of soldiers.")

            }
            else{
                $("#message").text("Gwangdeokjeong was designated as National Treasure in 1963. Today, the pavilion serves as a model of excellence in soldier training")
            }
        })
        $("#audio2").on("ended", function () {
            $("#templeGIF").hide();
            let s2 = document.querySelector('#s2')
            s2.setAttribute('visible','false')
            let s20 = document.querySelector('#s21')
            s20.setAttribute('visible','false')
            let marker2 = document.querySelector('#pos2').object3D.position;
            let marker3 = document.querySelector('#pos3').object3D.position;
            let scene = document.querySelector('a-scene');
            let t1 = document.createElement('a-entity');
            t1.setAttribute('gltf-model','#harubang')
            t1.setAttribute('id','t1')
            t1.object3D.position.copy(marker2);
            scene.append(t1);
            let curve = document.createElement('a-curve');
            curve.setAttribute('id', 'track2');
            let curvePoint1 = document.createElement('a-curve-point');
            let curvePoint2 = document.createElement('a-curve-point');
            curvePoint1.setAttribute('position', t1.object3D.position);
            curvePoint2.setAttribute('position', marker3);
            curve.appendChild(curvePoint1);
            curve.appendChild(curvePoint2);
            scene.appendChild(curve);
            t1.setAttribute('alongpath', {curve: '#track2', dur: 3000, rotate: true, delay: 1000});
            t1.addEventListener('movingended', stage2Finish)
            function stage2Finish() {
                let t1 = document.querySelector('#t1');
                if(t1) t1.parentNode.removeChild(t1);
                _this.stage3Handler();
            }
        })
    },
    stage3Handler: function () {
        let _this = this;
        $("#templeGIF").hide();
        let s1old = document.querySelector('#s1');
        s1old.setAttribute('visible','false')
        let s2 = document.querySelector('#s2')
        s2.setAttribute('visible','false')
        let s20 = document.querySelector('#s21')
        s20.setAttribute('visible','false')

        let s3 = document.querySelector('#s3')
        s3.setAttribute('visible','true')
        $(".stage").removeClass('btn-danger').addClass('btn-dark');
        $("#stage3").removeClass('btn-dark').addClass('btn-danger');
        $("#message").text("")
        $('.audio-play').each(function(){
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
        $("#audio3").trigger("play");
        $("#audio3").on("timeupdate",function () {
            if(0<this.currentTime && this.currentTime <5){
                $("#message").text("Bijarim Forest is an ideal spot for a relaxing forest retreat")
                $("#bijarim_tree").show()
                $("#bijarim_tree3").hide();
                $("#bijarim_tree2").hide();
                $("#bijarim_tree1").hide();
            }
            else if (5<this.currentTime && this.currentTime <11){
                $("#message").text("The dense forest is home to hundreds of bija (nutmeg yew) trees, and is the largest forest in the world to be made up of one plant species")
                $("#bijarim_tree").hide();
                $("#bijarim_tree3").hide();
                $("#bijarim_tree2").hide();
                $("#bijarim_tree1").show()
            }
            else if(11<this.currentTime && this.currentTime <18){
                $("#message").text("Most of the trees in the forest have lived for 500 to 700 years, earning the forest the nickname “Forest of a Thousand Years.”.")
                $("#bijarim_tree").hide();
                $("#bijarim_tree1").hide();
                $("#bijarim_tree3").hide();
                $("#bijarim_tree2").show();
            }
            else{
                $("#message").text("A must-see sight while at Bijarim Forest is none other than the 800-year old, conjoined nutmeg yews")
                $("#bijarim_tree2").hide();
                $("#bijarim_tree1").hide();
                $("#bijarim_tree").hide();
                $("#bijarim_tree3").show();
            }
        })
        $("#audio3").on("ended", function () {
            $("#bijarim_tree3").hide();
            $("#bijarim_tree2").hide();
            $("#bijarim_tree1").hide();
            $("#bijarim_tree").hide();
            $("#templeGIF").hide();
            let s3 = document.querySelector('#s3')
            s3.setAttribute('visible','false')
            let marker3 = document.querySelector('#pos3').object3D.position;
            let marker4 = document.querySelector('#pos4').object3D.position;
            let scene = document.querySelector('a-scene');

            let t1 = document.createElement('a-entity');
            t1.setAttribute('gltf-model','#harubang')
            t1.setAttribute('id','t1')
            t1.object3D.position.copy(marker3);
            scene.append(t1);
            let curve = document.createElement('a-curve');
            curve.setAttribute('id', 'track3');
            let curvePoint1 = document.createElement('a-curve-point');
            let curvePoint2 = document.createElement('a-curve-point');
            curvePoint1.setAttribute('position', t1.object3D.position);
            curvePoint2.setAttribute('position', marker4);
            curve.appendChild(curvePoint1);
            curve.appendChild(curvePoint2);
            scene.appendChild(curve);
            t1.setAttribute('alongpath', {curve: '#track3', dur: 3000, rotate: true, delay: 1000});
            t1.addEventListener('movingended', stage3Finish)
            function stage3Finish() {
                let t1 = document.querySelector('#t1');
                if(t1) t1.parentNode.removeChild(t1);
                _this.stage4Handler();
            }

        })

    },
    stage4Handler: function () {
        $("#templeGIF").hide();
        let _this = this;
        let s1old = document.querySelector('#s1');
        s1old.setAttribute('visible','false')
        let s2 = document.querySelector('#s2')
        s2.setAttribute('visible','false')
        let s20 = document.querySelector('#s21')
        s20.setAttribute('visible','false')

        let s3 = document.querySelector('#s3')
        s3.setAttribute('visible','false')

        let s4 = document.querySelector('#s4')
        s4.setAttribute('visible','true')
        $(".stage").removeClass('btn-danger').addClass('btn-dark');
        $("#stage4").removeClass('btn-dark').addClass('btn-danger');
        $("#message").text("")
        $('.audio-play').each(function(){
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
        $("#audio4").trigger("play");
        $("#audio4").on("timeupdate",function () {
            if(0<this.currentTime && this.currentTime <6){
                $("#village").show()
                $("#village1").hide()
                $("#village2").hide()
                $("#message").text("The Jeju Folk Village is the island’s main tourist attraction where customs of the old days can be explored")
            }
            else if (6<this.currentTime && this.currentTime <13){
                $("#village1").show()
                $("#village").hide()
                $("#village2").hide()
                $("#message").text("At Jeju Folk Village the unique lifestyle and traditional culture of Jeju Island are presented as they appeared during the 19th century")
            }

            else{
                $("#village2").show()
                $("#village").hide();
                $("#village1").hide();
                $("#message").text(" A mountain village, fishing village, botanical garden, market place, an old government building and authentic shamanistic rites one recreated on this 4500-hectare site in Pyoseon-ri")
            }
        })
        $("#audio4").on("ended", function () {
            $("#village").hide()
            $("#village1").hide()
            $("#village2").hide()
            setTimeout(_this.stage1Handler,3000)
        })
    },

    tick: function (time, timeDelta) {
        let pos1 = document.querySelector('#pos1').object3D;
        let pos2 = document.querySelector('#pos2').object3D;
        let pos3 = document.querySelector('#pos3').object3D;
        let pos4 = document.querySelector('#pos4').object3D;

        let flag1 = pos1.visible === true;
        let flag2 = pos2.visible === true;
        let flag3 = pos3.visible === true;
        let flag4 = pos4.visible === true;

        $('#stage1').prop('disabled', !flag1);
        $('#stage2').prop('disabled', !flag2);
        $('#stage3').prop('disabled', !flag3);
        $('#stage4').prop('disabled', !flag4);

    }
});