!function(){let e={};HTMLElement.prototype.pseudoStyle=function(t,n,o){let d="pseudoStyles",i=document.head||document.getElementsByTagName("head")[0],s=document.getElementById(d)||document.createElement("style");s.id=d;let m=e[t]||{},u=m[this.id]||{};u[n]=o,m[this.id]=u,e[t]=m;let y="";for([t,l]of Object.entries(e))for([c,r]of Object.entries(l)){for([n,o]of(y+=" #"+c+":"+t+"{",Object.entries(r)))y+=n+":"+o+";";y+="}"}return s.innerHTML=y,i.appendChild(s),this},document.stylereset=function(){let t="pseudoStyles",n=document.getElementById(t)||document.createElement("style");n.id=t,n.innerHTML="",e={}}}();
(function() {
	const JOBSID = {
	 /** Tanks: */
	 PLD: 19,
	 WAR: 21,
	 DRK: 32,
	 GNB: 37,

	 /** Heals: */
	 WHM: 24,
	 SCH: 28,
	 AST: 33,
	 SGE: 40,

	 /** Melee: */
	 MNK: 20,
	 DRG: 22,
	 NIN: 30,
	 SAM: 34,
	 RPR: 39,

	 /** Range: */
	 BRD: 23,
	 MCH: 31,
	 DNC: 38,

	 /** Magic: */
	 BLM: 25,
	 SMN: 27,
	 RDM: 35,
	 BLU: 36,
	};

	const AJL = (id, lvl) => {
		return {
			id: id,
			lvl: lvl,
		};
	};

	const nameToId = (name) => { return name.replace(/[ ']/g, "").toLowerCase(); };

	const container = document.querySelector(".container");
	const raidbuffs = [];
	let order = [];
	let party = [];
	let self = {name: "", job:-1, level: 0};

	const UPDATE = () => {
		if(doReset)
		{
			RESET();
			return;
		}
		
		order = [];
		for (let i = 0; i < raidbuffs.length; i++)
			raidbuffs[i].update();
			
		order.sort(function (a, b) {
			return a.timer - b.timer;
		});
		
		for (let i = 0; i < order.length; i++)
		{
			let el = container.querySelector("#"+order[i].id);
			if(isactive(el))
				el.style.order = i;
			else if(isfade(el))
				el.style.order = i + 200;
		}
	};
	
	let doReset = false;
	const reset = () => {
		doReset = true;
	};
	
	const RESET = () => {
		doReset = false;

		raidbuffs.forEach((e) => {
			for (let i = 0; i < e.buffs.length; i++)
				e.getElement(e.buffs[i]).remove();
			e.buffs = [];
			});

		document.stylereset();

		for(let i = 0; i < party.length; i++)
			for(let x = 0; x < raidbuffs.length; x++)
				if(raidbuffs[x].getAJL().id === party[i].job && raidbuffs[x].getAJL().lvl <= party[i].level)
					raidbuffs[x].up(nameToId(party[i].name));
	};

	const solo = () => {
		return [self];
	}
	
	const active = (el, desc) => {
		el.setAttribute("time", Date.now());
		el.classList.add("active");
		el.classList.remove("up");
		el.innerHTML = "" + this.time;
		el.pseudoStyle("before", "content", '"' + desc + '"')
		.pseudoStyle("before", "background-color", "black")
	};
	
	const fade = (el) => {
		el.classList.remove("active");
		el.classList.remove("up");
		el.innerHTML = "" + this.cd - this.time;
		el.pseudoStyle("before", "content", '""')
		.pseudoStyle("before", "background-color", "transparent")
	};
	
	const up = (el) => {
		el.classList.remove("active");
		el.classList.add("up");
		el.innerHTML = "";
		el.style.order = null;
	};
	
	const isactive = (el) => { return el.classList.contains("active"); };
	
	const isfade = (el) => { return !el.classList.contains("active") && !el.classList.contains("up"); };
	
	const isup = (el) => { return el.classList.contains("up"); };
	
	const RaidBuff = class {
		constructor(name, id, image, cd, time, desc, ajl = AJL(-1, 0))
		{
			this.name = name;
			this.id = new RegExp("^" + id + "$");
			this.ajl = ajl;
			this.image = image;
			this.cd = cd;
			this.time = time;
			this.desc = desc;
			this.buffs = [];
			
			console.log("Register Buff: \"" + name + "\"\t\t with id (" + id + "),\t\t Cooldown: " + cd + "s ,\t\t Duration: " + time + "s,\t\t Desc:" + desc);
		}
		
		update()
		{
			let now = Date.now();
			
			let b, el, time, timer, toshow = "", toshowround;
			
			for (let i = 0; i < this.buffs.length; i++)
			{
				b = this.buffs[i];
				el = this.getElement(b);
				
				if(isup(el))
					continue;
				
				time = el.getAttribute("time");
				
				if(time)
				{
					timer = (now - time) / 1000;
					
					if(isactive(el))
					{
						toshow = this.time - timer;
						if(timer > this.time)
							this.fade(b);
					}
					else if(isfade(el))
					{
						toshow = this.cd - timer;
						if(timer > this.cd)
							this.up(b);
					}

                    order.push({id: this.name + b, timer: toshow});
					toshowround = Math.floor(toshow);
                    if(toshowround >= 0 && el.innerHTML != toshowround)
                    	if(toshowround !== undefined)
                        	el.innerHTML = toshowround;
                    	else
                        	el.innerHTML = "";
				}
			}
		}
		
		getID()
		{ return this.id; }
		
		getAJL()
		{ return this.ajl; }
		
		getElement(player)
		{
			let div;
			
			let b = container.querySelectorAll(".buff#" + this.name + player);
			let a = b.length;

			if(a === 0)
			{
				div = document.createElement("div");
				
				div.classList.add("buff");
				div.style.backgroundImage = "url(\"" + this.image + "\")";
				div.id = this.name + player;
				
				container.appendChild(div);
				this.buffs.push(player);
			}
			else if(a > 1)
				for(let i = 1; i < a; i++)
					b[i].remove();
			else
				div = b[0];
			
			return div;
		}
		
		active(player)
		{
			active(this.getElement(player), this.desc);
		}
		
		isactive(player)
		{ return isactive(this.getElement(player)); }
		
		fade(player)
		{ fade(this.getElement(player)); }
		
		isfade(player)
		{ return isfade(this.getElement(player)); }
		
		up(player)
		{ up(this.getElement(player)); }
		
		isup(player)
		{ return isup(this.getElement(player)); }
	};
	
	
	raidbuffs.push(new RaidBuff("StratagemesEntrelaces", "1D0C", "https://xivapi.com/i/002000/002815_hr1.png", 120, 15, "10% CH", AJL(JOBSID.SCH, 66)));
	raidbuffs.push(new RaidBuff("Divination", "40A8", "https://xivapi.com/i/003000/003553_hr1.png", 120, 15, "6%", AJL(JOBSID.AST, 50)));
	raidbuffs.push(new RaidBuff("Fraternite", "1CE4", "https://xivapi.com/i/002000/002542_hr1.png", 120, 15, "5%", AJL(JOBSID.MNK, 70)));
	raidbuffs.push(new RaidBuff("LitanieCombattante", "DE5", "https://xivapi.com/i/002000/002585_hr1.png", 120, 15, "10% CH", AJL(JOBSID.DRG, 52)));
	raidbuffs.push(new RaidBuff("Rapine", "8C8", "https://xivapi.com/i/000000/000613_hr1.png", 120, 20, "5%", AJL(JOBSID.NIN, 14)));
	raidbuffs.push(new RaidBuff("CercleArcanique", "5F55", "https://xivapi.com/i/003000/003633_hr1.png", 120, 20, "3%", AJL(JOBSID.RPR, 72)));
	raidbuffs.push(new RaidBuff("VoixDeCombat", "76", "https://xivapi.com/i/002000/002601_hr1.png", 120, 15, "20% DH", AJL(JOBSID.BRD, 50)));
	raidbuffs.push(new class extends RaidBuff {
		active(player, data)
		{
			let p = "2";
			if(data && data.line && data.line[8])
				p = data.line[8].substring(0, 1);
			active(this.getElement(player), p + "%");
		}
	} ("FinalRadieux", "64B9", "https://xivapi.com/i/002000/002622_hr1.png", 110, 15, "2%", AJL(JOBSID.BRD, 90)));
	raidbuffs.push(new class extends RaidBuff {
		active(player, data)
		{
			let p = "0";
			if(data && data.line && data.line[4] !== "3E84")
			{
				p = data.line[4].substring(3);
				if(p === "4")
					p = "5";
			}
			active(this.getElement(player), p + "%");
		}
	} ("FinalTechnique", "(3E84|3F4(1|2|3|4))", "https://xivapi.com/i/003000/003473_hr1.png", 120, 20, "0%", AJL(JOBSID.DNC, 70)));
	raidbuffs.push(new RaidBuff("EclatArdent", "64C9", "https://xivapi.com/i/002000/002752_hr1.png", 120, 30, "3%", AJL(JOBSID.SMN, 66)));
	raidbuffs.push(new RaidBuff("Enhardissement", "1D60", "https://xivapi.com/i/003000/003218_hr1.png", 120, 20, "5%", AJL(JOBSID.RDM, 58)));
	raidbuffs.push(new RaidBuff("SansDefense", "2C93", "https://xivapi.com/i/003000/003279_hr1.png", 60, 15, "5%"));
	raidbuffs.push(new RaidBuff("LumiereSinistre", "2C9D", "https://xivapi.com/i/003000/003289_hr1.png", 60, 15, "5% Mag"));
	
	
	document.addEventListener("onOverlayStateUpdate", (data) => {
		if(data.detail.isLocked)
			document.querySelector("body").classList.remove("unlocked");
		else
			document.querySelector("body").classList.add("unlocked");
	});
	
	
	addOverlayListener('LogLine', (data) => {
		if(data.line[0] === "21" || data.line[0] === "22")
		{
			for(let i = 0; i < party.length; i++)
				if(party[i].id === data.line[2]) {
					for (i = 0; i < raidbuffs.length; i++)
						if (raidbuffs[i].getID().exec(data.line[4])) {
							raidbuffs[i].active(nameToId(data.line[3]), data);
							return;
						}
				}
		}
		if(data.line[0] === "03")
		{
			if(party.length <= 1)
			{
				if(data.line[3] === self.name)
				{
					self.id = data.line[2];
					self.job = parseInt(data.line[4], 16);
					self.level = parseInt(data.line[5], 16);
					party = solo();
					reset();
				}
			}
			else
				for(let i = 0; i < party.length; i++)
					if(party[i].name === data.line[3])
					{
						party[i].job = parseInt(data.line[4], 16);
						party[i].level = parseInt(data.line[5], 16);
						reset();

						// let name = party[i].name.replace(/[ ']/g, "").toLowerCase();
						//
						// for(let x = 0; x < raidbuffs.length; x++)
						// 	for (let i = 0; i < raidbuffs[x].buffs.length; i++)
						// 		if(raidbuffs[x].buffs[i] === name)
						// 		{
						// 			raidbuffs[x].buffs.slice(i, 1);
						// 			raidbuffs[x].getElement(name).remove();
						// 			break;
						// 		}
						//
						//
						//
						// for(let x = 0; x < raidbuffs.length; x++)
						// 	if(raidbuffs[x].getJob() === party[i].job)
						// 		raidbuffs[x].up(name);
					}

			if(DEBUG)console.log(party);
		}
		if(data.line[0] === "33" && (data.line[3].substring(6) === "0F" ||  data.line[3].substring(6) === "03"))
			reset();
	});

	addOverlayListener("ChangeZone", reset);

	addOverlayListener("ChangePrimaryPlayer", (data) => {
		self.name = data.charName;
		callOverlayHandler({ call: 'getCombatants' }).then(value => {
			for(let i = 0; i < value.combatants.length; i++)
				if(value.combatants[i].Name === self.name)
				{
					self.job = value.combatants[i].Job;
					self.level = value.combatants[i].Level;
					if(party.length <= 1)
					{
						party = solo();
						reset();
					}
				}
		});
	});

	addOverlayListener("PartyChanged", (data) => {
		party = data.party.length > 0 ? data.party : solo();
		reset();
		if(DEBUG)console.log(party);
	});

	startOverlayEvents();

	frameUpdate(UPDATE);


	// if(DEBUG)
	// {
	// 	setTimeout(() => {
	// 		for (let i = 0; i < raidbuffs.length; i++)
	// 			raidbuffs[i].active("test");
	// 	}, 1000);
	// }
})();