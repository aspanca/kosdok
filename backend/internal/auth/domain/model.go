package domain

type AuthSubject struct {
	UserID      string
	Email       string
	Roles       []string
	Permissions []string
}
