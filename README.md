Spidr

3 things for each data property:
Is it required?
Is it unique?
Is it optional? If so, does it have a default value


User
location: String!
name: String!
email: String!Unique
password: String!
image: String?With Default
jobTitle: String?
cohort: String?
slack: String?
personalSite: String?
socialMedias: ['linkedin', 'github', 'twitter']? = []
jobLocation: String?

Post
text: String!
user: User!
title: String?
date: Date!
hashtag: Hashtag?

Hashtag
text: String!

Comments:
text: String!
user: User!
post: Post!
date: Date!



GET 	/ Home Page  ✅
GET		/ Signup ✅
POST	/ Signup ✅
GET		/ Login ✅
POST	/ Login ✅
GET		/ Logout ✅
GET		/ see-posts
POST	/ add-post
GET 	/ Profiles
GET 	/ Profiles/:dynamic-id
GET		/ my-profile
POST	/ update-profile
POST	/ update-password
POST	/ delete-account
POST	/ add-comment
GET		/ one-sec 
POST	/ add-image
GET		/ map-view

