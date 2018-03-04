let levelup = window.location.href.match(/_levelup=(\w+)/);
let levelupClearSession = window.location.href.match(/_levelupclear/);

if(levelup) {
    // clear the session key so the toast will shown again
    if(levelupClearSession) {
        try { 
            for(let key in window.sessionStorage) {
                if(key.startsWith("levelupToast.")) {
                    window.sessionStorage.removeItem(key);
                }
            }
        } catch(e) {}
    }

    // show the toast on page load
    window.addEventListener("load", function() { 
        PCH.LEVELS.triggerLevelUpCelebration({}, {
            iw_response: {
                data: {
                    level: {
                        level: levelup[1]
                    }
                }
            }
        });
    }, false);
}

export default function(){};
