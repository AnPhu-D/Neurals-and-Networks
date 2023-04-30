url = 'http://10.13.51.221:7860/sdapi/v1/txt2img';
key = localStorage.getItem("key") || "API Key Here"

messages = [{
    "role": "user", "content": "For the rest of this conversation, reply as Matt. Matt is a Dungeon Master for a D&D game that is guiding my character through an adventure of his creation. Matt will provide detail about the events and circumstances of the scene, but will not make any decisions or actions on behalf of the player character. Matt will present options and allow the player to choose which option their character will take. Matt will not ascribe emotion, intentionality, or actions to the player character, making sure that the player character is always autonomous and can react to the scenario in any way they choose. Matt will be creative and inventive with his scenarios and will adapt the plot he has in mind to any decisions the characters make. Matt will never let the story get dull, writing new surprises or challenges into the story whenever the last challenge or surprise has been resolved. Matt will tailor his adventurers to the player character, coming up with challenges, puzzles, and combat encounters that their abilities make them uniquely suited to handle, or that are directly related to the character\'s background. Matt will not spoil upcoming details in his adventure, instead letting the players experience the plot without knowing what\'s going to happen next until it happens. Matt will present specific challenges, goals, puzzles, or combat encounters for the player character to tackle, without summarizing or giving away any information about what those challenges will involve. Matt has read all fiction literature, played all video games, and watched all television shows and movies, and borrows ideas from all of these sources to come up with interesting and setting-appropriate social, puzzle-solving, exploration, and combat challenges for his D&D game.\
Matt, let\'s get started with your adventure! I\'m playing Pierce, a warforged scavenger getting ready to enter the Mournland in the Eberron campaign setting to scavenge the wasteland for valuables. My base camp is the town of Salvation, an old-west-style scavenging outpost with colorful characters and suppliers that can give me scavenging missions and quests. My character starts at the Gray Beyond, a tavern in the center of Salvation where adventurers and scavengers commonly gather to trade stories and look for jobs. As a warforged I can\'t really drink, but I\'m sitting and enjoying the atmosphere and music."}, {
    "role": "assistant", "content": "As you sit in the Gray Beyond, the atmosphere is lively, with music and chatter filling the air. The bartender, a dwarf named Grundle, approaches you and asks if you\'re interested in a job.\
\"A group of scavengers just returned from a nearby ruin and reported seeing strange lights coming from within,\" Grundle explains. \"They didn\'t want to investigate further, but I\'m willing to pay a handsome sum to anyone who can tell me what\'s causing those lights.\"\
He slides a map across the bar towards you, pointing to a spot marked with an X. \"That\'s where they saw the lights. Interested in checking it out?\"\
As you look over the map, you notice that the spot marked with an X is on the outskirts of Salvation, near the edge of the Mournland. You can\'t see any details of the area, but you know that it\'s likely to be dangerous."}];

sdresult = ["start.png"]

extraPrompt = "masterpiece, fantasy, painting, "

convotrack = 0;
convomax = 0;

sdprompt = {
    "role": "user", "content": "A stable diffusion prompt is a series of phrases that describes a scene. Pretend that you are describing a scene to someone who is blind. All they need is to visualize the scene, so avoid any descriptions that do not contribute to the visual image. For example, names do not contribute to an image, so avoid names.\
here are examples of stable diffusion prompts:\
portrait photo of a asia old warrior chief, tribal panther make up, blue on red, side profile, looking away, serious eyes, 50mm portrait photography, hard rim lighting photography priest, blue robes, 68 year old man, national geographic, portrait, photo, photography ultrarealistic, (native american old woman ) portrait, cinematic lighting, award winning photo, no color, 80mm lense a vibrant professional studio portrait photography of a young, pale, goth, attractive, friendly, casual, delightful, intricate, gorgeous, female, piercing green eyes, wears a gold ankh necklace, femme fatale, nouveau, curated collection, annie leibovitz, nikon, award winning, breathtaking, groundbreaking, superb, outstanding, lensculture portrait awards, photoshopped, dramatic lighting, 8 k, hi res medium shot side profile portrait photo of the Takeshi Kaneshiro warrior chief, tribal panther make up, blue on red, looking away, serious eyes, 50mm portrait, photography, hard rim lighting photography gorgeous young Swiss girl sitting by window with headphones on, wearing white bra with translucent shirt over, soft lips, beach blonde hair, octane render, unreal engine, photograph, realistic skin texture, photorealistic, hyper realism, highly detailed, 85mm portrait photography, award winning, hard rim lighting photography\
based on analysis of these, can you generate a stable diffusion prompt based on the scene you just described? Give them to me in the format\
Stable Diffusion Prompt: <series of phrases> End Stable Diffusion Prompt. "}

window.onload = function () {

    document.getElementById("submittext").addEventListener("click", submitText);
    document.getElementById("outputtext").innerText = messages[1]['content'];
    document.getElementById("sceneimage").src = sdresult[0];
    document.getElementById("leftbutton").addEventListener("click", leftButton);
    document.getElementById("rightbutton").addEventListener("click", rightButton);
}

function submitText() {

    document.getElementById("submittext").disabled = true;

    messages.push({
        'role': 'user',
        'content': `Player: "${document.getElementById("inputtext").value}"`
    });
    const messagesWithSuffix = messages.slice(0);
    messagesWithSuffix[messagesWithSuffix.length-1].content += '\n\nAs the DM, respond with a line of narration up to THREE sentences without dialogue, followed an optional line of dialogue up to THREE sentences from any Non player character. There are no dialogue nor actions (including movement) made by the player as the DM respectfully maintains player autonomy. If nothing happens, ask the player for another action.';
    console.log({messagesWithSuffix});

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        // body: '{\n     "model": "gpt-3.5-turbo",\n     "messages": [{"role": "user", "content": "Say this is a test!"}],\n     "temperature": 0.7\n   }',
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages': messagesWithSuffix,
            'temperature': 0.7
        })
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            console.log(data);
            console.log(data['choices'][0]['message']['content'])
            messages.push({ 'role': 'assistant', 'content': data['choices'][0]['message']['content'] });
            convomax = convomax + 1;
            convotrack = convomax;
            document.getElementById("outputtext").innerText = messages[convotrack * 2 + 1]['content'];
            messages2 = messages.slice();
            messages2.push(sdprompt);

            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + key
                },
                body: JSON.stringify({
                    'model': 'gpt-3.5-turbo',
                    'messages': messages2,
                    'temperature': 0.7
                })
            }).then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    console.log(data);
                    console.log(data['choices'][0]['message']['content'])
                    // Get the text between Stable Diffusion Prompt:  and End Stable Diffusion Prompt.
                    prompt = data['choices'][0]['message']['content'].split("Stable Diffusion Prompt:")[1].split("End Stable Diffusion Prompt.")[0];

                    const sdquery = {
                        'prompt': extraPrompt + prompt,
                        'steps': 20,
                        'width': 512,
                        'height': 512,
                        'save_images': true
                    };

                    console.log(JSON.stringify(data));

                    response = fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(sdquery)
                    }).then(response => response.json())
                        .then(data => {
                            console.log('Success:', data);
                            sdresult.push("data:image/png;base64," + data['images'][0]);
                            document.getElementById("sceneimage").src = sdresult[convotrack];
                            document.getElementById("submittext").disabled = false;
                        });
                });
        });
}


function leftButton() {
    if (convotrack > 0) {
        convotrack = convotrack - 1;
        document.getElementById("outputtext").innerText = messages[convotrack * 2 + 1]['content'];
        document.getElementById("sceneimage").src = sdresult[convotrack];
    }
}

function rightButton() {
    if (convotrack < convomax) {
        convotrack = convotrack + 1;
        document.getElementById("outputtext").innerText = messages[convotrack * 2 + 1]['content'];
        document.getElementById("sceneimage").src = sdresult[convotrack];
    }
}