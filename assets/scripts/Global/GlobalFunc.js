cc.GlobalFunc = {
    //数字转汉字  例如 6---> 六, 16--->十六, 20--->二十, 26->二十六
    numberToChinese:function (num){
        let numList = ["一","二","三","四","五","六","七","八","九","十"];

        if (num <= 10){
            return numList[num]
        }
        else if(num < 20){
            return "十" + numList[Math.floor(num%10)];
        }
        else if(Math.floor(num%10) == 0 && num < 100){
            return numList[Math.floor(num/10)]+"十";
        }
        else if( num < 100){
            return numList[Math.floor(num/10)]+"十"+numList[Math.floor(num%10)];
        }
        else if( num < 1000){
            if (Math.floor((num%100)/10) == 0){
                return numList[Math.floor(num/100)]+"百"+"零"+numList[Math.floor(num%10)];
            }
            else{
                return numList[Math.floor(num/100)]+"百"+numList[Math.floor((num%100)/10)]+"十"+numList[Math.floor(num%10)];
            }
        }
    },

    //根据时间戳差值 获取格式化的时间 HH:MM:SS 08:10:33
    fromatHHMMSS:function (diff_timestamp,isSimple){
        let sec = diff_timestamp >= 0 ? diff_timestamp : 0
        let h = Math.floor(sec/3600)
        let m = Math.floor((sec-h*3600) / 60)
        let s = sec-h*3600-m*60
        if(isSimple){
            if (h > 0){
                return this.formatTime(h,m,s);
            }
            else{
                return this.formatTime(null,m,s);
            }
        }

        return this.formatTime(h,m,s);
    },

    // 时间格式拼接
    formatTime:function (h,m,s){
        let fillNum = (t)=>{
            if(t < 10){ return "0"+ t};
            return t;
        }
        let result = ""
        if(h != null && m != null && s != null){
            h = fillNum(h);
            m = fillNum(m);
            s = fillNum(s);

            result = h + ":" + m + ":" + s;
        }
        else if(!h && m != null && s != null){
            m = fillNum(m);
            s = fillNum(s);

            result = m + ":" + s;
        }
        else if(!h && !m && s != null){
            result = fillNum(s);
        }
        else{
            console.assert(false,"invalid params")
        }

        return result;
    },

    
};
