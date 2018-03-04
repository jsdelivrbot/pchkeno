/* */ 
Object.defineProperty(exports, "__esModule", {
    value: true
});

var rotateCSS = '<style type="text/css">#rotate_error{transform: translateZ(3px) !important; background:#434242;color:#fff;text-shadow:0 2px #0a0a0a;padding:10px 0;min-height:900px;font-weight:900;font-size:18px;display:none;position:absolute;top:0;width:100%;z-index:9999}#rotate_error #re_innerholder{width:100%;margin:0 auto;text-align:center}#rotate_error #re_innerholder #img{width:55px;height:62px;margin:10px auto 20px;width: 55px;height: 62px;background-size: 100%;background-repeat: no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAB8CAYAAACIRYVrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAC/BJREFUeNrsnXusXEUdxz/7uret2EAFpIjSploViQIlWKso0T4ppCokSpWAIRLiGyUawIaXoIkkPksaH7UNWg2BCAhYCiVaAkVDW1FESkQsokCpaZDeu3v37u7xj98c+uv0bO/dvWfmPO75JZPdu3d3z5n57nfm9/vOb2ZKQRCQM7sV+BzwAjm2cg7rdA7wBHBBnoEr5ZBxukKbgIuBXQXjsmWLgcdN11kqGJcdxml7CLgI2FkwLlv2XuAx4HKgWjAuO4zTtsOwb0fBuGzZycAfgRuAwYJx2WGctp2GfQ8VjMuWvRV4EPgBcFjBuOwwTtsuE/dtKhiXLTseuBdYBxxRMC5+qwBvA2abxg7LccCCmK7xggncbyuA69+mA/MNKAvM827jUdwKyW2kULROM3CDwArgU8CiHrp1F9LWXuDLpgstgOtipxiwzgNm9FMnh/eWGtE6LcAdCXwSuBB450Tr5Phe9yGy2eoJerCZBm4J8GngbKAWV5083XuionVSwM0Gfggsc1Enj/UYAa4Bvg208gzcAHAZcCUw1VWdEvghehetfQJ3BnCTib+c1imhbr9lmHeNYWLmgTsKuBE439ePMWFHy4toXXbcgBcDT3oELQ3mRbR2xbjXImlyi5JwuFIEojPR2gXjjgF+lxBoabNQtP4ZMYvWcTPuLcBG4+4nFpumFMRYRes4GXeaGZBnF0Rzb3EBdyawGZGuCjvY1gEnEOMUURzAXQjcDrymwCfSOVmCiOZ708S4K4C15CBPMWYLEEnvRBylQUzEOfmMubm02aQIwPsF7jRgC6I9FsCJpV7yeh2wDXhTSrupSSEyl/tolJtTDJpvGzHj/Gl4Tmfv1alYBSwt8AIyNJG6CPgt6c/FLFIXlB0HbE9pgN0E/oIs4njUhCeuLFPJQjXg90guY1rsbwagB5E1byNWDBW3pS49bzxj3FdSAtoo8GtgDTL74MsymRA7HfgH/eU3xmX/Q2bQfzLOxouLcalOQR+LcZcmDNqdwGeBf3u+7npT972k1A7FuBmGbdMTuK/dwBeAW/r47KRfZnVZQqD9ApkCucXjNZ2Lwr4YdzTwNP6naq4DrooBhF4sV0uJv+YZtMC421d5vGYL+CbwrqyB1o1xxwJ/B6Z4uoc2sn5gXYw/grEsl9tlXOERtA7wMY+BbWKisGvGHQE8j795tquBax10u1GW6y2hlnoE7QHgGx6usw/4PHB6XkCLCsCXe7rui8hCxo7j60yKbQ8r+Jlr6xjQXGp/e5HssyV5BM1m3AL8yFtrkBxMV5ZKUdglcD66ySbwLcfXOJdJYGXPwK0FnqOw2MKBWYig7NJGkUUhzxbNHh/jzvJwrXUFaPED56ObvLFo7ni7ygrwCm5lrp3A24vmjpdxs3GvTW4smjp+4OZ6uE4BnIM4zjVwdSS9z5fNBVYC80wBWeuwDdgAPJUL5IIgWB0EQcdhuTsIAjyUUhAEXwqCYDjobsPmPSVP9+SslIE3O/5tbPfhZAF3Ad/h0FtNTTXvuYuMH9lSBg53fI0XPdTji8g69PHameYzmQbO9ZbtrsXeucjBD73aDZ4cswK4LraS/nbim4rsQlsAlxBw8ybw2VML4LIJ3LwsA+d6cV6uDtxLE3D7HF/jWMffvy2hzyYO3CuTGLhHC+CSA24DIqv1anXgl0VXmRxwTyHZyb3aFWRYtywjKz5d2kwP9fgecE8P77/HfCbTzsk/HV9jjod6BEj6xaVjdJt1856zSHCrizis6qG7+CAyUdvwAN53DZtyP61TCoJgOfAbx9dZ4eEaky6O8/ELXFE0dfyMqwJDxHcoUZS9ZJyUTtHk8TGuBTzh+DpHISffTxarOCbCq3mVmz1U5uOTCLiacfyqroF7wENlLmJybG1fA6Yp1lVdArcFye13aQPIdhh5t+kGLM26KjFvFxl+2T7gDx4qdR5wco5Bm4Lk8AwY4DTrKnGCp7/ofh9eLLK3SF7tGANQVbEuBK8WJ/v0F/zKU+UWAwtzCNrhyIremmHcQESXqdkXAljuA7OSvV3GI8geIK7tOXOdvCz3HTRDQIDspdJUZRTZhCd8bJt4tmPeHz5iHoMuPVVYAFo22j/3VNHjkLXagzmJ2eYhuTsDilU1a6yrdimafRU1Fpat18LyqnKib+JIZG/ImqdKr0fOncmyLQBeb5jWUIwbUYxrGqGjbR4149oW24IItmnWNYCOzbg9yE7nvuwCZOvgrNpJyNGaNatEjW3aUdEsq1qMsplYsYL5ThTjAN6P3z2P28hOCXdkDLS5yD4qI8g83wgwbNjVUKwbVaWlxjl7rItinc22oTDejvJotpjic4y4NWPMOx2R8KaZcXrQMGLQMGowIgSI8irtAL1sMU2XQIsk3TYaXUgyO6WuBy7Bw6FCE5CzViJ7XNYNsxqGCXXFvoZp5EbEONeyxrmQeVjM04wDeNl8xyGBA9gKvDuBxtkKnJPCUGEGkvbwBgPQkAGmbrrI8HldOSaNMbrLVpewwLaW8T8iA3Dbrk2ogd6DnNqRpiD9VCS56B1W9xgG2oOqTDFlIKLUujgthwoTquaHcaCrOca5A3cDyxJssE3IOTZJbQp6ArIb+zxEz9WsqlvdZF39P3xsWgF5y2Kd7jI7yjEpKfY1onqfsYCbAzyecKAcIImrq4BnPF1zFvBVJBusbnWJ4d/DFmDD1vuaKrbTKsqoArAdAZqdJbBLj23jBQ7kBMJVKeiumsBPDYgPE38aRBmZpT/XiAKBueaQckKGLadk2HJMhpWDEr42osa5EUsC6yjmRQXgu5G0D/oBbirwV/MrTIu9hGSN3QHcR/+pf1OQ49XONuw6ynIWWgosDeKwAko/t7vLRhft0nZSorrLEeDJbj/Q8R5DttgoKmlcMjWEzOA/jewn/R+rgKTB6zLTDANncOA2/bqraqvYqWnGuGYX1tnd6YgFnB0WjHKg6Ny2QAuQE7te7lbpXg7+uw64knxZJ2I87VjPQz1xSIEwpECxx7pGl66yYVhmA9dSXWYI2jOMkWHeSz7E1cD7gA+Qf4sSeqdZ4ZO9KLRklSiFv2na3BaedSC+h3HsMtgLcG2jGuxAjnDJg5UjVIsy+xV7+/mABVQo2XUDrWJJWjUFWk2pKCFodeDP43G8es1Aeh74hBnvqjkDr2RJTfp5xTRuydT7MAVQCEpJMatm6Y1hsD2iQItyUh4cr6PVT+NvRraEX5vDLjIETDMtSmlqG2+7YoFbiWBbCGKonNjBeOi93meIgSvgQHZ7nQlcn8OxrWSNXSEjK6aB9etVE1KELCur53XFuhCwAcO6lnkMmXa/8SJxDRxIttZMZKv4vHiW3bpL/X/NuhC8kmKb1htHVBfZYP+UT9MAPopMoT3cc9fQQzjQbXy4mQzv0NMlLNDOStt6T0v93bIetZOhJ1QbimW6q3wE+HE/KlA1hgqfD/w348wrj6PxwvdUFXgV61ErMiHrmoplA8ohudNIeH1JdxNlnLbLMzzmdbqAZwu/OnRoWwG6rYK0LEa2lVa5hglm1MUJHMh5Nj/KaKjQ6dJV2op9x+pG26oL7ajXggggG4hoP+H8mriBA/gQckDt0RlmX9TfnYjXNEBEjHUayD3IDPrWWOIWB8BhvM0NGZXHunWXdGGenR8ZBdpW5Ay73XEOyi7seST14Hqyty1F+RCv2VplScVu5YjnZeAmRCrcHedNumKctsVmMJ6VYUfFTinQ/9MKiw4VnjVd4wO+fl1x2yYkyeY60pt2N1ablCLYRkQoELr/NwLzcbjS1wfjtM0Bvk+yCUgTDcq1stK2/rcRuAyZ1PX+63JpTyMHMC3HzwrYibZNOYJ5JQ4UozF1+TDwER+gJcE42xYCX0fWK2RhzLNF6C2IZnu/75tKGrjQlhp3eSH+lnj123WOmnF7Ncmk6acKuNBOQjKuPork56fJdgC3IxrjY0nfTNqA07YCWcY0HzgR/zJaC0kGfgSZ8U/VJnJpBk7bMsPGU5C11sdzsCI/UWsjWcPbkS0S/wTcm9YGyQpwUXYJ8EZk9cyxiDY6DZlSmcr+xRdwcJLqsFEynkOWTv8LEcczY/8fALlpn+fxz+KhAAAAAElFTkSuQmCC);}#rotate_error #re_innerholder #img img{width:100%;height:100%}#rotate_error.showerror{display:block}</style>';
var rotateErrorDiv = '<div id="rotate_error"> <div id="re_innerholder"> <div id="top_msg">Please Rotate Your Screen</div> <div id="img">  </div> <div id="btm_msg">Looks like you\'re in landscape mode.<br>Flip your phone to continue playing.</div> </div> </div>';
var RotateError = {

    showHideError: function() {
        switch (window.orientation) {        
            case -90:
                        
            case 90:
                $('body, html').scrollTop();
                window.setTimeout(function() {
                    window.scrollTo(0, 0);
                }, 500);                
                console.log('show error');
                $('#rotate_error').addClass("showerror");    

                break;        
            default:
                            $('#rotate_error').removeClass("showerror");  
                console.log('remove error');          
                break;    
        }
    },
    bind: function() {
        $('body').append(rotateCSS);
        $('body').append(rotateErrorDiv);
   
        window.addEventListener('orientationchange', this.showHideError);
        if (window.matchMedia) {
            if (window.matchMedia("(orientation: landscape)").matches) {
                $('#rotate_error').addClass("showerror");
            }

        }
    }
}

exports.default = RotateError;