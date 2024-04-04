import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class ChatData{
    constructor(rel,backRel,user){
        this.rel=rel
        this.backRel=backRel
        this.lastMessage = null
        this.other = ((rel?.follower == useAuthStore().authData.id) ? (rel?.expand?.following ?? backRel?.expand?.follower) : (rel?.expand?.follower ?? backRel?.expand?.following)) ?? user
        this.lastSeen = rel?.lastseen || 0
        this.unseenCount = 0
        this.updated = rel?.expand?.following?.updated
        this.lastVisited = this.updated
        this.relId = rel?.id
        this.backRelId = backRel?.id
        this.otherLastSeen = backRel?.lastseen || 0
        this.messages=[]
        this.cacheNewMessages=false
        this.isOnline=this.other.online
        this.active=rel?.active
        this.backActive=backRel?.active
        this.messagesType='chat'
    }

    async init(){

        try{
            this.lastMessage = await pb.collection('chatMessages').getFirstListItem(`from = "${this.other.id}" || to = "${this.other.id}"`, {sort:'-created',$autoCancel:false})
        }catch{}
        try{
            await this.updateUnseenCount()
        }catch{}



    }

    async updateUnseenCount(){this.unseenCount=(await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${this.other.id}" && created > "${this.lastSeen}"`, sort:'-created',$autoCancel:false})).totalItems;}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllChatsData{
    constructor(){
        this.rels=[]
        this.allDatas=new Map()
        this.backRels=[]
        this.contacts=[]
    }

    async updateContacts(){this.contacts=await pb.collection('contacts').getFullList({expand:'following'});}
    async updateUnseenCount(id){await this.allDatas.get(id).updateUnseenCount()}
    async updateRels(){this.rels=await pb.collection('rels').getFullList({
        expand:'follower,following'
    });this.backRels=this.rels.filter(rel=>rel.follower != useAuthStore().authData.id);this.rels=this.rels.filter(rel=>rel.follower == useAuthStore().authData.id);}

    async updateAllMessages(){
        await Promise.allSettled(this.rels.map((rel)=>{
                let index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                this.allDatas.set(index, new ChatData(rel,this.backRels.find(i=>i.follower == rel.following)))
                return this.allDatas.get(index).init()
        }))



}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class GroupData{
    constructor(groupRel,group){
        this.groupMems=new Map()
        this.lastMessage=null
        this.group=groupRel?.expand?.group ?? group
        this.messages=[]
        this.unseenCount=0
        this.cacheNewMessages=false
        this.lastSeen=groupRel?.lastseen || 0
        this.groupRelId=groupRel?.id
        this.active=groupRel?.active ?? false
        this.blockList=groupRel?.expand?.group?.blocklist || group?.blocklist || []
        this.blocked=this.blockList.includes(useAuthStore().authData.id)
        this.messagesType='group'

    }

    async init(){
        try{
            this.lastMessage = await pb.collection('groupMessages').getFirstListItem(`group = "${this.group.id}"`, {sort:'-created',expand:'from',$autoCancel:false})
        }catch{}
        try{
            await this.updateUnseenCount()
        }catch{}
        finally{
            await this.updateMembers()
            console.log('g mems : ',this.groupMems);
        }
    }
    
    async updateMembers(){await (pb.collection('groupMembers').getFullList({filter:`group = "${this.group.id}"`,expand:'mem',$autoCancel:false})).then(res=>{res.forEach(groupRel=>this.groupMems.set(groupRel.mem, groupRel.expand.mem));})}

    async updateUnseenCount(){this.unseenCount=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && group = "${this.group.id}" && created > "${this.lastSeen}"`, sort:'-created',$autoCancel:false})).totalItems;}

    async updateGroup(){this.group=await pb.collection('groups').getOne(this.group.id)}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllGroupsData{
    constructor(){
        this.groupRels=[]
        // this.groups={}
        this.allDatas=new Map()
    }

    // async updateGroups(){(await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})).map(rec=>{this.groups[rec.group]=rec.expand.group;this.groups[rec.group]['lastSeen']=rec.lastseen;this.groups[rec.group]['groupRelId']=rec.id});}
    // async updateGroupRels(){this.groupRels = await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})}
    async updateMembers(groupId){await this.allDatas.get(groupId).updateMembers()}
    async updateRels(){
        this.groupRels=await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'});
        this.groupRels.forEach(groupRel=>{try{this.allDatas.get(groupRel.group).active=groupRel.active}catch{}})
    }
    async updateUnseenCount(groupId){await this.allDatas.get(groupId).updateUnseenCount()}
    async updateAllMessages(){
  await Promise.allSettled(this.groupRels.map((groupRel)=>{
        let index=groupRel.group
        this.allDatas.set(index, new GroupData(groupRel))
        return this.allDatas.get(index).init()
}))

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ChannelData{
    constructor(channelRel=null,channel=null){
        this.channelMems=new Map()
        this.lastMessage=null
        this.channel=channelRel?.expand?.channel ?? channel
        this.messages=[]
        this.unseenCount=0
        this.cacheNewMessages=false
        this.lastSeen=channelRel?.lastseen || 0
        this.channelRelId=channelRel?.id
        this.active=true
        this.messagesType='channel'
    }

    async init(){
        try{
            this.lastMessage=await pb.collection('channelMessages').getFirstListItem(`channel = "${this.channel.id}"`, {sort:'-created',$autoCancel:false})
        }catch{}
        try{
            await this.updateUnseenCount()
        }catch{}

    }

    async updateMembers(){this.channelMems=(await pb.collection('channelMembers').getFullList({filter:`channel = "${this.channel.id}"`,expand:'mem'})).map(channelRel=>{this.channelMems.set(channelRel.mem, channelRel.expand.mem)});}

    async updateUnseenCount(){
        if(this.channel.owner == useAuthStore().authData.id){this.unseenCount=0}
        else{this.unseenCount=(await pb.collection('channelMessages').getList(1, 1, {filter:`channel = "${this.channel.id}" && created > "${this.lastSeen}"`, sort:'-created',$autoCancel:false})).totalItems;}
    }

    async updateChannel(){this.channel=await pb.collection('channels').getOne(this.channel.id)}


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllChannelsData{
    constructor(){
        // this.channels={}
        this.channelRels=[]
        this.allDatas=new Map()
    }

    async updateMembers(channelId){await this.allDatas.get(channelId).updateMembers()}
    async updateRels(){this.channelRels=await pb.collection('channelMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'channel'});}
    async updateUnseenCount(channelId){await this.allDatas.get(channelId).updateUnseenCount()}
    async updateAllMessages(){
        await Promise.allSettled(this.channelRels.map((channelRel)=>{
              let index=channelRel.channel
              this.allDatas.set(index, new ChannelData(channelRel))
              return this.allDatas.get(index).init()
      }))
      
          }
    
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    AllChatsData,
    ChatData,
    AllGroupsData,
    GroupData,
    AllChannelsData,
    ChannelData
}
