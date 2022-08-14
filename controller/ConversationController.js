const Chat = require('../models/chat')
const Conversation = require('../models/conversation')
const { CLIENT_SITE, INVITE_LINK } = require('../config/env.config')
const jwt = require('jsonwebtoken')

const ConversationController = {
	// Get all Conversation by userId
	async get(req, res) {
		try {
			const { userId, type } = req.query
			if (type === 'All') {
				const conversation = await Conversation.find({
					members: { $in: [userId] },
				})
					.sort({ updatedAt: -1 })
					.populate('members')
					.populate('membersLeave')
				return res.json(conversation)
			} else {
				const conversation = await Conversation.find({
					members: { $in: [userId] },
					type,
				})
					.sort({ updatedAt: -1 })
					.populate('members')
					.populate('membersLeave')
				return res.json(conversation)
			}
		} catch (error) {
			return res.json(error)
		}
	},
	// Get all count unReadMsg Conversation by userId
	async getCountUnReadMsg(req, res) {
		try {
			const conversation = await Conversation.find({
				members: { $in: [req.params.userId] },
			})

			return res.json(conversation)
		} catch (error) {
			return res.json(error)
		}
	},
	// Get One Friend Conversation by userId
	async getOne(req, res) {
		try {
			const conversation = await Conversation.findOne({
				members: { $all: [req.body.currentUserId, req.body.friendId] },
				type: 'Friend',
			}).populate('members')
			return res.json(conversation)
		} catch (error) {
			return res.json(error)
		}
	},

	// Post edit group by master
	async editGroup(req, res) {
		try {
			let result = await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
				},
				{
					name: req.body.name,
					des: req.body.des,
					rule: req.body.rule,
					private: req.body.privacy,
				},
				{ new: true }
			)
				.populate('members')
				.populate('membersLeave')
			return res.json({ msg: 'update success', success: true, result })
		} catch (error) {
			return res.json(error)
		}
	},
	//
	async getInviteCode(req, res) {
		try {
			const found = await Conversation.findOne({
				_id: req.body.roomId,
			})
			if (found.inviteCode !== '') {
				jwt.verify(found.inviteCode, INVITE_LINK, (err, data) => {
					if (err) return res.json({ success: false, err })

					return res.json({ success: true })
				})
			} else {
				// Create new link
				const link = jwt.sign({ roomId: found._id }, INVITE_LINK, {
					expiresIn: '10s',
				})
				return res.json({ success: true, link })
			}
			return res.json({ success: false, msg: 'not found converstion' })
		} catch (error) {
			return res.json(error)
		}
	},
	// Post delete a Conversation => then delete all chat of this conversation
	async delete(req, res) {
		const currentUserId = req.body.currentUserId
		const friendId = req.body.friendId

		try {
			let conver = await Conversation.findOneAndDelete({
				members: { $all: [friendId, currentUserId] },
			})
			await Chat.deleteMany({ roomId: conver._id })
			return res.json({ msg: 'Delete success' })
		} catch (error) {
			return res.json(error)
		}
	},
	// Post create new Conversation
	async postFriend(req, res) {
		const newConversation = new Conversation({
			members: [req.body.senderId, req.body.receiverId],
			owner: req.body.senderId,
			type: 'Friend',
		})

		try {
			const saved = await newConversation.save()
			return res.json(saved)
		} catch (error) {
			return res.json(error)
		}
	},
	// Post create new Group
	async postGroup(req, res) {
		const newConversation = new Conversation({
			members: req.body.members,
			owner: req.body.owner,
			name: req.body.nameGroup,
			des: req.body.des,
			rule: req.body.rule,
			private: req.body.privacy,
			type: 'Group',
		})

		try {
			const saved = await newConversation.save()
			return res.json({ msg: 'Create success', success: true, saved })
		} catch (error) {
			return res.json(error)
		}
	},
	// Get last message by roomId
	async lastMsg(req, res) {
		try {
			const chat = await Chat.findOne({
				roomId: req.params.roomId,
			})
				.sort({ _id: -1 })
				.limit(1)
			return res.json(chat)
		} catch (error) {
			return res.json(error)
		}
	},
	// Post user unRead
	async postUnReadMsg(req, res) {
		try {
			// Find in readBy
			let found = await Conversation.findOne({
				_id: req.body.roomId,
				'readBy._id': { $all: req.body.recivers.map((i) => i._id) },
			})

			// Not Found push every users in readBy with defalt {0 (currentUser) , 1 (order) }
			if (found === null) {
				let result = await Conversation.findOneAndUpdate(
					{
						_id: req.body.roomId,
					},
					{
						readBy: req.body.recivers,
					},
					{ new: true }
				)

				return res.json({ msg: 'first Push', result })
				// increase all field count by one except user who send this
			} else {
				let result = await Conversation.findOneAndUpdate(
					{
						_id: req.body.roomId,
					},
					{
						$inc: {
							'readBy.$[x].count': 1,
						},
					},
					{
						arrayFilters: [
							{
								'x._id': { $ne: req.body.senderId },
							},
						],
						new: true,
					}
				)

				return res.json({ msg: 'found', result })
			}
		} catch (error) {
			return res.json(error)
		}
	},
	// Post user Read message
	async postReadMsg(req, res) {
		try {
			await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
					'readBy._id': req.body.currentUserId,
				},
				{
					$set: {
						'readBy.$._id': req.body.currentUserId,
						'readBy.$.count': 0,
					},
				}
			)

			return res.json({ msg: 'Readed ' })
		} catch (error) {
			return res.json(error)
		}
	},
	// Post user leave group
	async leaveGroup(req, res) {
		try {
			const result = await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
				},
				{
					$pull: {
						members: req.body.currentUserId,
					},
					$addToSet: {
						membersLeave: req.body.currentUserId,
					},
				},
				{ new: true }
			)
				.populate('members')
				.populate('membersLeave')

			return res.json({ success: true, msg: 'User leave', result })
		} catch (error) {
			return res.json({ success: false, msg: error })
		}
	},
	// Post Group master Delete group
	async deleteGroup(req, res) {
		try {
			await Conversation.findOneAndDelete({
				_id: req.body.roomId,
				owner: req.body.currentUserId,
			})

			return res.json({ success: true, msg: 'User delete group' })
		} catch (error) {
			return res.json({ success: false, msg: error })
		}
	},

	// Post Group master add friend to group
	async addIntoGroup(req, res) {
		try {
			const result = await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
				},
				{
					$push: {
						members: req.body.friendId,
					},
					$pull: {
						membersLeave: req.body.friendId,
					},
				},
				{ new: true }
			)
				.populate('members')
				.populate('membersLeave')

			return res.json({
				success: true,
				msg: 'User add into group',
				result,
			})
		} catch (error) {
			return res.json(error)
		}
	},
	// Post user ban in group
	async bannedUser(req, res) {
		try {
			const result = await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
				},
				{
					$addToSet: {
						membersBanned: {
							_id: req.body.memberId,
							reason: req.body.reason,
							time: req.body.time,
						},
					},
				},
				{ new: true }
			)
				.populate('members')
				.populate('membersLeave')

			return res.json({ success: true, msg: 'User banned', result })
		} catch (error) {
			return res.json({ success: false, msg: error })
		}
	},
	// Post user unban in group
	async unBannedUser(req, res) {
		try {
			const result = await Conversation.findOneAndUpdate(
				{
					_id: req.body.roomId,
				},
				{
					$pull: {
						membersBanned: {
							_id: req.body.memberId,
						},
					},
				},
				{ new: true }
			)
				.populate('members')
				.populate('membersLeave')

			return res.json({ success: true, msg: 'User unbanned', result })
		} catch (error) {
			return res.json({ success: false, msg: error })
		}
	},
}

module.exports = ConversationController
