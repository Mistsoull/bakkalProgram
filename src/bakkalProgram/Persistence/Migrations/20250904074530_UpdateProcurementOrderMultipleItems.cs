using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProcurementOrderMultipleItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "ProductName",
                table: "ProcurementOrders");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "ProcurementOrders",
                newName: "SupplierId1");

            migrationBuilder.AlterColumn<string>(
                name: "SupplierName",
                table: "ProcurementOrders",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "ProcurementOrders",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpectedDeliveryDate",
                table: "ProcurementOrders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReceived",
                table: "ProcurementOrders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "ProcurementOrders",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ProcurementOrderItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProcurementOrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcurementOrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProcurementOrderItems_ProcurementOrders_ProcurementOrderId",
                        column: x => x.ProcurementOrderId,
                        principalTable: "ProcurementOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProcurementOrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProcurementOrders_SupplierId1",
                table: "ProcurementOrders",
                column: "SupplierId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProcurementOrderItems_ProcurementOrderId",
                table: "ProcurementOrderItems",
                column: "ProcurementOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ProcurementOrderItems_ProductId",
                table: "ProcurementOrderItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId",
                table: "ProcurementOrders",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId1",
                table: "ProcurementOrders",
                column: "SupplierId1",
                principalTable: "Suppliers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId",
                table: "ProcurementOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId1",
                table: "ProcurementOrders");

            migrationBuilder.DropTable(
                name: "ProcurementOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_ProcurementOrders_SupplierId1",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "ExpectedDeliveryDate",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "IsReceived",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "ProcurementOrders");

            migrationBuilder.RenameColumn(
                name: "SupplierId1",
                table: "ProcurementOrders",
                newName: "ProductId");

            migrationBuilder.AlterColumn<string>(
                name: "SupplierName",
                table: "ProcurementOrders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "ProcurementOrders",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Amount",
                table: "ProcurementOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                table: "ProcurementOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId",
                table: "ProcurementOrders",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id");
        }
    }
}
