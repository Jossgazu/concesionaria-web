package main

import (
	"log"

	"github.com/concesionaria-web/backend/internal/config"
	"github.com/concesionaria-web/backend/internal/database"
	"github.com/concesionaria-web/backend/internal/handler"
	"github.com/concesionaria-web/backend/internal/middleware"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	_ = db

	userRepo := repository.NewUserRepository(db)
	vehicleRepo := repository.NewVehicleRepository(db)
	valuationRepo := repository.NewValuationRepository(db)
	favoriteRepo := repository.NewFavoriteRepository(db)
	ratingRepo := repository.NewRatingRepository(db)
	messageRepo := repository.NewMessageRepository(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	vehicleService := service.NewVehicleService(vehicleRepo, userRepo)
	valuationService := service.NewValuationService(valuationRepo)
	favoriteService := service.NewFavoriteService(favoriteRepo)
	messageService := service.NewMessageService(messageRepo)

	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userRepo, vehicleRepo, ratingRepo, cfg.UploadPath)
	vehicleHandler := handler.NewVehicleHandler(vehicleService)
	valuationHandler := handler.NewValuationHandler(valuationService)
	favoriteHandler := handler.NewFavoriteHandler(favoriteService)
	ratingHandler := handler.NewRatingHandler(ratingRepo, userRepo)
	messageHandler := handler.NewMessageHandler(messageService)

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024,
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(middleware.CORS())
	app.Use(middleware.RateLimit())

	app.Static("/uploads", "./uploads")

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", middleware.Protected(cfg.JWTSecret), authHandler.Me)
	auth.Put("/profile", middleware.Protected(cfg.JWTSecret), userHandler.UpdateProfile)

	users := api.Group("/users")
	users.Get("/:id", userHandler.GetPublicProfile)
	users.Get("/:id/vehicles", userHandler.GetUserVehicles)
	users.Put("/profile", middleware.Protected(cfg.JWTSecret), userHandler.UpdateProfile)
	users.Post("/avatar", middleware.Protected(cfg.JWTSecret), userHandler.UploadAvatar)

	profile := api.Group("/profile", middleware.Protected(cfg.JWTSecret))
	profile.Get("/", userHandler.GetProfile)

	vehicles := api.Group("/vehicles")
	vehicles.Get("/", vehicleHandler.GetAll)
	vehicles.Get("/featured", vehicleHandler.GetFeatured)
	vehicles.Get("/my", middleware.Protected(cfg.JWTSecret), vehicleHandler.GetSellerVehicles)
	vehicles.Get("/:id", vehicleHandler.GetByID)
	vehicles.Post("/", middleware.Protected(cfg.JWTSecret), vehicleHandler.Create)
	vehicles.Put("/:id", middleware.Protected(cfg.JWTSecret), vehicleHandler.Update)
	vehicles.Delete("/:id", middleware.Protected(cfg.JWTSecret), vehicleHandler.Delete)
	vehicles.Post("/:id/images", middleware.Protected(cfg.JWTSecret), vehicleHandler.UploadImage)
	vehicles.Delete("/:id/images/:imageId", middleware.Protected(cfg.JWTSecret), vehicleHandler.DeleteImage)
	vehicles.Put("/:id/images/:imageId/primary", middleware.Protected(cfg.JWTSecret), vehicleHandler.SetPrimaryImage)

	valuations := api.Group("/valuations", middleware.Protected(cfg.JWTSecret))
	valuations.Post("/", valuationHandler.CreateValuation)
	valuations.Get("/", valuationHandler.GetValuations)
	valuations.Get("/:id", valuationHandler.GetValuation)

	favorites := api.Group("/favorites", middleware.Protected(cfg.JWTSecret))
	favorites.Post("/:vehicleId", favoriteHandler.AddFavorite)
	favorites.Delete("/:vehicleId", favoriteHandler.RemoveFavorite)
	favorites.Get("/", favoriteHandler.GetFavorites)

	ratings := api.Group("/ratings")
	ratings.Post("/", middleware.Protected(cfg.JWTSecret), ratingHandler.Create)
	ratings.Get("/user/:userId", ratingHandler.GetUserRatings)
	ratings.Get("/user/:userId/summary", ratingHandler.GetUserRatingSummary)

	messages := api.Group("/messages", middleware.Protected(cfg.JWTSecret))
	messages.Post("/", messageHandler.SendMessage)
	messages.Get("/", messageHandler.GetConversations)
	messages.Get("/:userId", messageHandler.GetConversation)
	messages.Put("/:id/read", messageHandler.MarkAsRead)

	dashboard := api.Group("/dashboard", middleware.Protected(cfg.JWTSecret))
	dashboard.Get("/stats", vehicleHandler.GetDashboardStats)
	dashboard.Get("/vehicles", vehicleHandler.GetSellerVehicles)

	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := app.Listen(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
