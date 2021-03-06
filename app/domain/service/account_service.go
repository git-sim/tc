package service

import (
	"github.com/git-sim/tc/app/domain/entity"
	"github.com/git-sim/tc/app/domain/repo"
)

// Dependency inversion layer to prevent Account from having to know about the repo ifc
// for example the the Account doesn't have to know about how to check if the email is unique

// AccountService struct
type AccountService struct {
	repo                  repo.AccountRepo
	regAccountSubscribers []func(entity.Account)
}

// NewAccountService takes in the account repository
func NewAccountService(newrepo repo.AccountRepo) *AccountService {
	return &AccountService{
		repo: newrepo,
	}
}

// AlreadyExists returns if the account exists
func (s *AccountService) AlreadyExists(email string) bool {
	_, err := s.repo.Retrieve(email)
	if err == nil {
		return true
	}
	return false
}

// AlreadyExistsByID ...
func (s *AccountService) AlreadyExistsByID(id entity.AccountIDType) bool {
	_, err := s.repo.RetrieveByID(id)
	if err == nil {
		return true
	}
	return false
}

// GetIDFromEmail utility reverse lookup
func (s *AccountService) GetIDFromEmail(email string) (entity.AccountIDType, error) {
	val, err := s.repo.Retrieve(email) //todo replace with the promised quick mapping
	if err == nil {
		return val.GetID(), nil
	}
	return 0, err
}

// todo put a real notification system in
// SubscribeRegisterAccount Simple pub-sub notification, need to generalize into a class, and add locking
func (s *AccountService) SubscribeRegisterAccount(fn func(entity.Account)) {
	s.regAccountSubscribers = append(s.regAccountSubscribers, fn)
}

// NotifyRegisterAccount an new account has been created, notify interested parties so they can take action
func (s *AccountService) NotifyRegisterAccount(acc entity.Account) {
	for _, fn := range s.regAccountSubscribers {
		fn(acc)
	}
}
